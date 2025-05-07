#!/bin/bash

# Get Homebrew prefix
BREW_PREFIX=$(brew --prefix)

# Check if path argument is provided
if [ $# -ne 1 ]; then
    echo "Error: Please provide the configuration directory path"
    echo "Usage: $0 <config-dir-path>"
    exit 1
fi

CONFIG_DIR="$1"

# Check if directory exists
if [ ! -d "$CONFIG_DIR" ]; then
    echo "Error: Directory $CONFIG_DIR does not exist"
    exit 1
fi

# Check if required files exist
if [ ! -f "$CONFIG_DIR/hosts" ]; then
    echo "Error: hosts file not found in $CONFIG_DIR"
    exit 1
fi

if [ ! -f "$CONFIG_DIR/nginx.conf" ]; then
    echo "Error: nginx.conf file not found in $CONFIG_DIR"
    exit 1
fi

# Create timestamp for backups
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$CONFIG_DIR/backups"

# Backup current hosts file
echo "Creating backup of current hosts file..."
sudo cp /etc/hosts "$CONFIG_DIR/backups/hosts_backup_$TIMESTAMP"
if [ $? -ne 0 ]; then
    echo "Error: Failed to create hosts backup"
    exit 1
fi

# Backup current nginx configuration
echo "Creating backup of current nginx configuration..."
sudo cp "$BREW_PREFIX/etc/nginx/nginx.conf" "$CONFIG_DIR/backups/nginx.conf_backup_$TIMESTAMP"
if [ $? -ne 0 ]; then
    echo "Error: Failed to create nginx configuration backup"
    exit 1
fi

# Apply hosts file configuration
echo "Updating hosts file..."
sudo cp "$CONFIG_DIR/hosts" /etc/hosts
if [ $? -ne 0 ]; then
    echo "Error: Failed to update hosts file"
    exit 1
fi

# Apply nginx configuration
echo "Updating nginx configuration..."
sudo cp "$CONFIG_DIR/nginx.conf" "$BREW_PREFIX/etc/nginx/nginx.conf"
if [ $? -ne 0 ]; then
    echo "Error: Failed to update nginx configuration"
    exit 1
fi

# Test nginx configuration
echo "Testing nginx configuration..."
sudo nginx -t
if [ $? -ne 0 ]; then
    echo "Error: Invalid nginx configuration"
    exit 1
fi

# Reload nginx
echo "Reloading nginx..."
sudo nginx -s reload
if [ $? -ne 0 ]; then
    echo "Error: Failed to reload nginx"
    exit 1
fi

echo "Configuration applied successfully!"
exit 0

