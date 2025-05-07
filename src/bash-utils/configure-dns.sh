#!/bin/bash

# Domains to configure.
domains=(
  "localmember.wasatchpeaks.com"
  "localmember.wp.blossombeta.com"
  "localmember.stj.blossombeta.com"
  "localmember.bhcu.blossombeta.com"
  "localmember.homecu.blossomdev.com"
  "localmember.clarity.blossombeta.com"
  "localmember.pdcu.blossomdev.com"
  "localauth.wp.blossombeta.com"
  "localauth.homecu.blossomdev.com"
  "localauth.bhcu.blossombeta.com"
  "localauth2.wp.blossombeta.com"
  "localauth.pdcu.blossomdev.com"
  "localadmin.homecu.blossomdev.com"
  "localadmin.cucentric.blossomdev.com"  
  "localadmin.crossvalley.blossomalpha.com"
  "localadmin.stj.blossombeta.com"
  "localadmin.wp.blossombeta.com"
  "localadmin2.wp.blossombeta.com"
  "localadmin.bhcu.blossombeta.com"
  "localadmin.clarity.blossombeta.com"
  "localadmin.amucu.blossombeta.com"
  "localadmin.wp2.blossomalpha.com"
  "localadmin.sandjfcu.blossom.net"
  "localadmin.pdcu.blossomdev.com"
  "localcms.homecu.blossomdev.com"
  "localcms.pdcu.blossomdev.com"
  "localviewer.wp.blossombeta.com"
  "localviewer.bhcu.blossombeta.com"
  "localviewer.stj.blossombeta.com"
  "localviewer.clarity.blossombeta.com"
  "localviewer.homecu.blossomdev.com"
  "localviewer.pdcu.blossomdev.com"
  "localbreeze.homecu.blossomdev.com"
  "localbreeze.pdcu.blossomdev.com"
  "localui.blossomdev.com"
)

# Path where the DNSmasq configuration should be located
dnsmasq_conf_file_path="$(brew --prefix)/etc/dnsmasq.conf"

# Get the default route
default_route=$(route -n get default | grep 'interface:' | awk '{print $2}')

# Check if we got a result
if [ -z "$default_route" ]; then
  echo "No active network interface found."
  exit 1
else
  echo "The current active network interface is: $default_route"
fi

# Get the IP address using ifconfig and awk
ip_address=$(ifconfig $default_route | awk '/inet /{print $2}')

echo "Your IP address is: $ip_address"

echo "Writing to $dnsmasq_conf_file_path"

# Check if the file exists
if [ -f "$dnsmasq_conf_file_path" ]; then
  echo "domain-needed" >>$dnsmasq_conf_file_path
  echo "bogus-priv" >>$dnsmasq_conf_file_path

  for i in "${!domains[@]}"; do
    echo "address=/${domains[$i]}/$ip_address" >>$dnsmasq_conf_file_path
  done

  echo "conf-dir=/opt/homebrew/etc/dnsmasq.d" >>$dnsmasq_conf_file_path

  echo "Done!"
else
  echo "$dnsmasq_conf_file_path does not exist."
  exit 1
fi
