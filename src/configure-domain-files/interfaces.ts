export enum App {
  MEMBER = "member",
  ADMIN = "admin",
  DREAM = "dream",
  AUTH = "auth",
  VIEWER = "viewer",
  BREEZE = "breeze",
  UI = "ui",
  CMS = "cms",
  CAKE = "cake",
  SWIPE = "swipe",
}

export interface AppConfig {
  app: App;
  port: number;
}

export interface AppConfigExtended extends AppConfig {
  domains: string[];
}

export interface DomainGeneratorConfig {
  app: App;
  platforms: string[];
  subdomains: SubDomainGeneratorConfig[];
}

export interface SubDomainGeneratorConfig {
  creditUnions: string[];
  subdomain: string;
}

export interface NginxConfig {
  workerProcesses: number;
  events: {
    workerConnections: number;
  };
  http: HttpConfig;
  sslParamsPath: string;
}

export interface HttpConfig {
  includeFiles?: string[];
  proxyBuffering: boolean;
  sendfile: boolean;
  keepaliveTimeout: number;
  gzip: {
    enabled: boolean;
    static: boolean;
    types: string[];
    proxied: string;
    minLength: number;
  };
  upstreams: AppConfig[];
  servers: Array<{
    listen: number;
    serverName: string;
    ssl?: boolean;
    return?: string;
    locations?: {
      [path: string]: {
        root?: string;
        index?: string[];
        proxy_pass?: string;
      };
    };
  }>;
}
