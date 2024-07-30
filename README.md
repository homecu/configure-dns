# How to run.

1. Install brew.
2. Install dnsmasq.
3. Configure a static ip address for your computer.
4. Execute the following command on terminal
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/jgimitola-blossom/configure-dns/main/src/configure-dns.sh)"
```

5. Execute `sudo brew services restart dnsmasq`

If the step 5 does not work. Restart using:

`sudo brew services stop dnsmasq`
`sudo brew services start dnsmasq`
