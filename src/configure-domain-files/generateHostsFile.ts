import fs from "fs/promises";

const DEFAULT_HOSTS_CONTENT = `##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost
`;

export const generateHostsFile = async (
  domains: { domain: string }[],
  outputPath: string,
  ip: string = "localhost"
) => {
  const selectedIp = ip;
  const hostsContent = domains.reduce(
    (acc, { domain }) => acc + `${selectedIp} ${domain}\n`,
    DEFAULT_HOSTS_CONTENT
  );

  await fs.writeFile(`${outputPath}/hosts`, hostsContent);
  return `${outputPath}/hosts`;
};
