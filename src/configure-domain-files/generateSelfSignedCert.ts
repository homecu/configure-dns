import * as fs from "fs/promises";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

interface CertOptions {
  days?: number;
  commonName?: string;
  organization?: string;
}

/**
 * Checks if mkcert is installed in the system
 */
async function checkMkcertInstalled(): Promise<boolean> {
  try {
    await execPromise("mkcert -version");
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Generate SSL certificates using mkcert utility
 */
export async function generateSelfSignedCert(
  outputPath: string,
  domains: { domain: string }[] = []
): Promise<{ certPath: string; keyPath: string }> {
  // Make sure the output directory exists
  try {
    await fs.access(outputPath);
  } catch {
    await fs.mkdir(outputPath, { recursive: true });
  }

  const certPath = path.join(outputPath, "ssl.crt");
  const keyPath = path.join(outputPath, "ssl.key");

  // Check if mkcert is installed
  const isMkcertInstalled = await checkMkcertInstalled();

  if (!isMkcertInstalled) {
    throw new Error(
      "mkcert is not installed. Please install it with 'brew install mkcert' on macOS or follow instructions at https://github.com/FiloSottile/mkcert"
    );
  }

  // Extract unique domain names
  const uniqueDomains = [...new Set(domains.map((d) => d.domain))];

  // Add localhost and 127.0.0.1 to the domains list
  const allDomains = ["localhost", "127.0.0.1", ...uniqueDomains];

  console.log(`Generating certificates for ${allDomains.length} domains...`);

  try {
    // Generate certificate with mkcert for all domains
    const { stdout, stderr } = await execPromise(
      `mkcert -cert-file "${certPath}" -key-file "${keyPath}" ${allDomains.join(
        " "
      )}`
    );

    console.log(stdout);

    if (stderr) {
      console.warn("Warnings from mkcert:", stderr);
    }

    console.log(`Certificates generated at ${certPath} and ${keyPath}`);

    return { certPath, keyPath };
  } catch (error: any) {
    console.error("Error generating certificates:", error.message);
    throw new Error(`Failed to generate certificates: ${error.message}`);
  }
}
