import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import computeDomainsFromConfig from "./computeDomainsFromConfig";
import { appsConfig, domainGeneratorConfigs } from "./configurations";
import { generateHostsFile } from "./generateHostsFile";
import { generateNginxConfig } from "./generateNginxConfig";
import { generateProxyParamsFile } from "./generateProxyParams";
import { generateSelfSignedCert } from "./generateSelfSignedCert";
import generateServerConfig from "./generateServerConfig";
import { generateSSLParamsFile } from "./generateSSLParams";
import { 
  saveGenerateParameters, 
  getLastGenerateParameters, 
  hasLastGenerateParameters 
} from "../utils/parameterMemory";

const main = async (outputPath: string, ip?: string) => {
  if (!outputPath) {
    throw new Error("Output path is required");
  }

  const domains = domainGeneratorConfigs.flatMap((config) =>
    computeDomainsFromConfig(config)
  );

  const appsWithPaths = [...new Set(domains.map((domain) => domain.app))].map(
    (app) => appsConfig.find((config) => config.app === app)!
  );

  const proxyParamsPath = `${outputPath}/proxy_params`;
  const sslParamsPath = `${outputPath}/ssl_params.conf`;

  const { certPath, keyPath } = await generateSelfSignedCert(
    outputPath,
    domains
  ); // Pass domains to the function

  const proxyParamsPromise = generateProxyParamsFile(outputPath);

  const sslParamsPromise = generateSSLParamsFile(outputPath, {
    certificatePath: certPath,
    certificateKeyPath: keyPath,
  });

  const serverConfigPromise = generateServerConfig(domains, {
    outputPath: outputPath,
    proxyParamsPath,
    sslParamsPath,
  });

  const hostsFilePromise = generateHostsFile(domains, outputPath, ip);

  await Promise.all([
    proxyParamsPromise,
    sslParamsPromise,
    serverConfigPromise,
    hostsFilePromise,
  ]);

  const appsPaths = appsWithPaths.map(
    ({ app }) => `${outputPath}/${app}_servers.conf`
  );

  await generateNginxConfig(
    {
      sslParamsPath,
      workerProcesses: 1,
      events: {
        workerConnections: 1024,
      },
      http: {
        proxyBuffering: false,
        sendfile: true,
        keepaliveTimeout: 65,
        gzip: {
          enabled: true,
          static: true,
          types: [
            "text/plain",
            "text/css",
            "application/json",
            "application/javascript",
            "text/xml",
            "application/xml",
            "application/xml+rss",
            "text/javascript",
          ],
          proxied: "any",
          minLength: 1024,
        },
        upstreams: appsWithPaths,
        includeFiles: [proxyParamsPath, ...appsPaths],
        servers: [
          {
            listen: 80,
            serverName: "localhost",
            return: "301 https://$host$request_uri",
          },
          {
            listen: 443,
            serverName: "localhost",
            ssl: true,

            locations: {
              "/": {
                root: "html",
                index: ["index.html", "index.htm"],
              },
            },
          },
        ],
      },
    },
    outputPath
  );
};

const argv = yargs(hideBin(process.argv))
  .option("output", {
    alias: "o",
    type: "string",
    description: "Output directory path for configuration files",
    demandOption: false,
  })
  .option("ip", {
    alias: "i",
    type: "string",
    description: "IP address for hosts file configuration",
    default: "127.0.0.1",
  })
  .option("regenerate", {
    alias: "r",
    type: "boolean",
    description: "Use the last saved parameters to regenerate configuration",
    default: false,
  })
  .help().argv;

(async () => {
  const { output: outputPath, ip, regenerate } = await argv;

  let finalOutputPath: string;
  let finalIp: string;

  if (regenerate) {
    if (!hasLastGenerateParameters()) {
      console.error("Error: No saved parameters found. Please run the command with -o option first.");
      process.exit(1);
    }
    
    const lastParams = getLastGenerateParameters();
    finalOutputPath = lastParams.outputPath!;
    finalIp = lastParams.ip || "127.0.0.1";
    
    console.log(`Using saved parameters:`);
    console.log(`  Output path: ${finalOutputPath}`);
    console.log(`  IP address: ${finalIp}`);
  } else {
    if (!outputPath) {
      console.error("Error: Output path is required. Use -o option or --regenerate flag.");
      process.exit(1);
    }
    
    finalOutputPath = outputPath;
    finalIp = ip || "127.0.0.1";
    
    // Save parameters for future use
    saveGenerateParameters(finalOutputPath, finalIp);
    console.log("Parameters saved for future regeneration.");
  }

  main(finalOutputPath, finalIp).catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
})();
