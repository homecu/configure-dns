import * as fs from "fs/promises";
import { NginxConfig } from "./interfaces";

export const generateNginxConfig = async (
  config: NginxConfig,
  outputPath: string
): Promise<void> => {
  const nginxContent = `
worker_processes  ${config.workerProcesses};

events {
    worker_connections  ${config.events.workerConnections};
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    proxy_buffering ${config.http.proxyBuffering ? "on" : "off"};   
    sendfile        ${config.http.sendfile ? "on" : "off"};
    keepalive_timeout  ${config.http.keepaliveTimeout};

    gzip_static ${config.http.gzip.static ? "on" : "off"};
    gzip ${config.http.gzip.enabled ? "on" : "off"};
    gzip_types ${config.http.gzip.types.join(" ")};
    gzip_proxied ${config.http.gzip.proxied};
    gzip_min_length ${config.http.gzip.minLength};
    
    ${config.http.upstreams
      .map(
        (app) => `
    upstream ${app.app}_app {
        server localhost:${app.port};
    }`
      )
      .join("\n")}

    ${config.http.includeFiles
      ?.map((file) => `include ${file};`)
      .join("\n    ")}

    ${config.http.servers
      .map(
        (server) => `
    server {
        listen ${server.listen}${server.ssl ? " ssl" : ""};
        server_name ${server.serverName};
        ${server.return ? `return ${server.return};` : ""}
        ${server.ssl ? `include ${config.sslParamsPath};` : ""}
        ${Object.entries(server.locations || {})
          .map(
            ([path, location]) => `
        location ${path} {
            ${location.root ? `root ${location.root};` : ""}
            ${location.index ? `index ${location.index.join(" ")};` : ""}
            ${location.proxy_pass ? `proxy_pass ${location.proxy_pass};` : ""}
        }`
          )
          .join("\n")}
    }`
      )
      .join("\n")}
}`.trim();

  await fs.writeFile(`${outputPath}/nginx.conf`, nginxContent);
};
