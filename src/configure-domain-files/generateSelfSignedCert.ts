import * as crypto from "crypto";
import * as fs from "fs/promises";
import * as forge from "node-forge";
import * as path from "path";

interface CertOptions {
  days?: number;
  commonName?: string;
  organization?: string;
}

export async function generateSelfSignedCert(
  outputPath: string,
  options: CertOptions = {}
): Promise<{ certPath: string; keyPath: string }> {
  const {
    days = 365,
    commonName = "localhost",
    organization = "Self-Signed Certificate",
  } = options;

  // Make sure the output directory exists
  try {
    await fs.access(outputPath);
  } catch {
    await fs.mkdir(outputPath, { recursive: true });
  }

  const certPath = path.join(outputPath, "ssl.crt");
  const keyPath = path.join(outputPath, "ssl.key");

  // Generate a key pair
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  // Create a validity period
  const validFrom = new Date();
  const validTo = new Date(validFrom);
  validTo.setDate(validFrom.getDate() + days);
  // Create a certificate using node-forge
  const cert = forge.pki.createCertificate();
  cert.publicKey = forge.pki.publicKeyFromPem(publicKey);
  cert.privateKey = forge.pki.privateKeyFromPem(privateKey);
  cert.serialNumber = crypto.randomBytes(16).toString("hex");
  cert.validity.notBefore = validFrom;
  cert.validity.notAfter = validTo;

  cert.setSubject([
    { name: "commonName", value: commonName },
    { name: "organizationName", value: organization },
  ]);
  cert.setIssuer([
    { name: "commonName", value: commonName },
    { name: "organizationName", value: organization },
  ]);

  cert.sign(cert.privateKey);

  // Export the certificate and key
  await fs.writeFile(certPath, forge.pki.certificateToPem(cert));
  await fs.writeFile(keyPath, privateKey);

  return { certPath, keyPath };
}
