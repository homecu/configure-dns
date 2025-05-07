import type { App, DomainGeneratorConfig } from "./interfaces";

interface DomainResult {
  domain: string;
  app: App;
}

const computeDomainsFromConfig = (
  config: DomainGeneratorConfig
): DomainResult[] => {
  const results: DomainResult[] = [];

  // Iterate through each platform
  config.platforms.forEach((platform) => {
    // Iterate through each subdomain configuration
    config.subdomains.forEach((subdomainConfig) => {
      if (subdomainConfig.creditUnions.length === 0) {
        results.push({
          domain: `${platform}.${subdomainConfig.subdomain}`,
          app: config.app,
        });
      } else {
        // Handle case with credit unions
        subdomainConfig.creditUnions.forEach((creditUnion) => {
          results.push({
            domain: `${platform}.${creditUnion}.${subdomainConfig.subdomain}`,
            app: config.app,
          });
        });
      }
    });
  });

  return results;
};

export default computeDomainsFromConfig;
