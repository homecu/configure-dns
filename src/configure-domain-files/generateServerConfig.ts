import * as fs from "fs/promises";
import * as path from "path";
import { App } from "./interfaces";

/**
 * Configuration options for the Nginx server
 */
interface ServerConfigOptions {
  sslParamsPath: string;
  proxyParamsPath: string;
  outputPath: string;
  httpPort?: number;
  httpsPort?: number;
}

/**
 * Generates Nginx configuration files for server blocks, one per app
 * @param domains - Array of domain objects with domain name and associated app
 * @param options - Configuration options
 * @returns Array of paths to created configuration files
 */
async function generateServerConfig(
  domains: { domain: string; app: App }[],
  options: ServerConfigOptions
): Promise<string[]> {
  // Set default options
  const {
    sslParamsPath,
    proxyParamsPath,
    outputPath,
    httpPort = 80,
    httpsPort = 443,
  } = options;

  // Group domains by app
  const domainsByApp = domains.reduce((acc, { domain, app }) => {
    const appName = app;
    if (!acc[appName]) {
      acc[appName] = [];
    }
    acc[appName].push(domain);
    return acc;
  }, {} as Record<string, string[]>);

  const createdFiles: string[] = [];

  // Create a config file for each app
  for (const [appName, appDomains] of Object.entries(domainsByApp)) {
    const appConfigPath = path.join(outputPath, `${appName}_servers.conf`);

    // Format domains with proper indentation
    const formattedDomains = appDomains
      .map((domain, index) =>
        index === 0 ? `server_name   ${domain}` : `                  ${domain}`
      )
      .join("\n");

    // Generate the configuration
    const configContent = `# ${appName} application servers
server {
    listen        ${httpPort};
    ${formattedDomains};

    # Redirect all HTTP traffic to HTTPS
    return 301 https://$host$request_uri;
}

# HTTPS ${appName} application servers
server {
    listen        ${httpsPort} ssl;
    ${formattedDomains};

    # Include SSL parameters instead of repeating them
    include ${sslParamsPath};

    location / {
        proxy_pass  http://${appName}_app;
        include     ${proxyParamsPath};
    }
}`;

    try {
      // Ensure directory exists
      const dirPath = path.dirname(appConfigPath);
      try {
        await fs.access(dirPath);
      } catch {
        await fs.mkdir(dirPath, { recursive: true });
      }

      // Write configuration to file
      await fs.writeFile(appConfigPath, configContent, "utf8");

      createdFiles.push(appConfigPath);
    } catch (error) {
      console.error(
        `Failed to create nginx configuration file for ${appName}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return createdFiles;
}

export default generateServerConfig;
