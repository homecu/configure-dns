import type { AppConfig, DomainGeneratorConfig } from "./interfaces";
import { App } from "./interfaces";

export const appsConfig: AppConfig[] = [
  {
    app: App.MEMBER,
    port: 3006,
  },
  {
    app: App.ADMIN,
    port: 3002,
  },
  {
    app: App.AUTH,
    port: 3000,
  },
  {
    app: App.VIEWER,
    port: 3003,
  },
  {
    app: App.BREEZE,
    port: 4011,
  },
  {
    app: App.UI,
    port: 3004,
  },
];

export const domainGeneratorConfigs: DomainGeneratorConfig[] = [
  {
    app: App.ADMIN,
    platforms: ["localadmin"],
    subdomains: [
      {
        creditUnions: ["homecu"],
        subdomain: "blossomdev.com",
      },
    ],
  },
];
