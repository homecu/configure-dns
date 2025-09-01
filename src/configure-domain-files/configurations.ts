import type { AppConfig, DomainGeneratorConfig } from "./interfaces";
import { App } from "./interfaces";

export const appsConfig: AppConfig[] = [
  {
    app: App.MEMBER,
    port: 3006,
  },
  {
    app: App.CMS,
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
    app: App.DREAM,
    port: 4012,
  },
  {
    app: App.UI,
    port: 3004,
  },
  {
    app: App.CAKE,
    port: 3012,
  },
  {
    app: App.SWIPE,
    port: 3004,
  },
];

export const domainGeneratorConfigs: DomainGeneratorConfig[] = [
  {
    app: App.MEMBER,
    platforms: ["localmember"],
    subdomains: [
      {
        creditUnions: ["wasatchpeaks"],
        subdomain: "com",
      },
      {
        creditUnions: ["wp", "stj", "bhcu", "clarity", "propell"],
        subdomain: "blossombeta.com",
      },
      {
        creditUnions: ["homecu", "pdcu"],
        subdomain: "blossomdev.com",
      },
    ],
  },
  {
    app: App.CMS,
    platforms: ["localcms"],
    subdomains: [
      {
        creditUnions: [],
        subdomain: "blossomdev.com",
      },
      {
        creditUnions: ["homecu"],
        subdomain: "blossomdev.com",
      },
    ],
  },
  {
    app: App.AUTH,
    platforms: ["localauth"],
    subdomains: [
      {
        creditUnions: ["wp", "bhcu", "stj", "clarity", "propell"],
        subdomain: "blossombeta.com",
      },
      {
        creditUnions: ["homecu", "pdcu"],
        subdomain: "blossomdev.com",
      },
    ],
  },
  {
    app: App.ADMIN,
    platforms: ["localmagic"],
    subdomains: [
      {
        creditUnions: ["wasatchpeaks"],
        subdomain: "com",
      },
    ],
  },
  {
    app: App.CAKE,
    platforms: ["localcake"],
    subdomains: [
      {
        creditUnions: [],
        subdomain: "blossomalpha.com",
      },
      {
        creditUnions: [],
        subdomain: "blossomdev.com",
      },
    ],
  },
  {
    app: App.ADMIN,
    platforms: ["localadmin"],
    subdomains: [
      {
        creditUnions: ["cucentric", "homecu", "pdcu"],
        subdomain: "blossomdev.com",
      },
      {
        creditUnions: ["crossvalley", "wp2"],
        subdomain: "blossomalpha.com",
      },
      {
        creditUnions: ["wp", "stj", "bhcu", "clarity", "amucu"],
        subdomain: "blossombeta.com",
      },
      {
        creditUnions: ["sandjfcu"],
        subdomain: "blossom.net",
      },
    ],
  },
  {
    app: App.VIEWER,
    platforms: ["localviewer"],
    subdomains: [
      {
        creditUnions: ["wp", "bhcu", "stj", "clarity"],
        subdomain: "blossombeta.com",
      },
      {
        creditUnions: ["homecu", "pdcu"],
        subdomain: "blossomdev.com",
      },
    ],
  },
  {
    app: App.BREEZE,
    platforms: ["localbreeze"],
    subdomains: [
      {
        creditUnions: ["homecu", "pdcu"],
        subdomain: "blossomdev.com",
      },
    ],
  },
  {
    app: App.UI,
    platforms: ["localui"],
    subdomains: [
      {
        creditUnions: [],
        subdomain: "blossomdev.com",
      },
    ],
  },
  {
    app: App.DREAM,
    platforms: ["localdream"],
    subdomains: [
      {
        creditUnions: ["homecu"],
        subdomain: "blossomdev.com",
      },
    ],
  },
  {
    app: App.SWIPE,
    platforms: ["localswipe"],
    subdomains: [
      {
        creditUnions: ["pdcu", "homecu"],
        subdomain: "blossomdev.com",
      },
      {
        creditUnions: ["wp", "stj"],
        subdomain: "blossombeta.com",
      },
    ],
  },
];
