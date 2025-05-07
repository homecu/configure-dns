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
      // Iterate through each credit union
      subdomainConfig.creditUnions.forEach((creditUnion) => {
        // Construct the domain and add it to the result with app information
        results.push({
          domain: `${platform}.${creditUnion}.${subdomainConfig.subdomain}`,
          app: config.app,
        });
      });
    });
  });

  return results;
};

export default computeDomainsFromConfig;
