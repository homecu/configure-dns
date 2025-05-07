import * as fs from "fs/promises";
import * as path from "path";

/**
 * Generates a proxy_params configuration file at the specified location
 * @param destinationPath - The directory where the proxy_params file should be created
 * @returns A promise that resolves when the file is created successfully
 */
export async function generateProxyParamsFile(
  destinationPath: string
): Promise<void> {
  const content = `proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;`;

  const filePath = path.join(destinationPath, "proxy_params");
  await fs.writeFile(filePath, content, "utf8");
}
