import * as fs from "fs/promises";
import * as path from "path";

/**
 * SSL parameters configuration options
 */
export interface SSLParamsOptions {
  certificatePath: string;
  certificateKeyPath: string;
  protocols?: string[];
  preferServerCiphers?: boolean;
  sessionCache?: string;
  sessionTimeout?: string;
}

/**
 * Generates an SSL parameters configuration file at the specified location
 * @param destinationPath - The directory where the ssl_params.conf file should be created
 * @param options - Configuration options for SSL parameters
 * @param filename - Optional custom filename (defaults to 'ssl_params.conf')
 * @returns A promise that resolves when the file is created successfully
 */
export async function generateSSLParamsFile(
  destinationPath: string,
  options: SSLParamsOptions,
  filename: string = "ssl_params.conf"
): Promise<void> {
  // Set default values for optional parameters
  const protocols = options.protocols || ["TLSv1.2", "TLSv1.3"];
  const preferServerCiphers =
    options.preferServerCiphers !== undefined
      ? options.preferServerCiphers
      : true;
  const sessionCache = options.sessionCache || "shared:SSL:10m";
  const sessionTimeout = options.sessionTimeout || "10m";

  const content = `# SSL Configuration
ssl_certificate      ${options.certificatePath};
ssl_certificate_key  ${options.certificateKeyPath};
ssl_protocols        ${protocols.join(" ")};
ssl_prefer_server_ciphers  ${preferServerCiphers ? "on" : "off"};
ssl_session_cache    ${sessionCache};
ssl_session_timeout  ${sessionTimeout};`;

  const filePath = path.join(destinationPath, filename);
  await fs.writeFile(filePath, content, "utf8");
}
