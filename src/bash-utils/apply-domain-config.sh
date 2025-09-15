#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARAM_HELPER="$SCRIPT_DIR/../configure-domain-files/param-helper.ts"

# Get Homebrew prefix
BREW_PREFIX=$(brew --prefix)

# Function to show usage
show_usage() {
    echo "Usage: $0 <config-dir-path>"
    echo "       $0 --reapply"
    echo ""
    echo "Options:"
    echo "  <config-dir-path>  Path to the configuration directory"
    echo "  --reapply         Use the last saved configuration path"
}

# Handle arguments
CONFIG_DIR=""
REAPPLY=false

if [ $# -eq 0 ]; then
    echo "Error: No arguments provided"
    show_usage
    exit 1
elif [ $# -eq 1 ]; then
    if [ "$1" = "--reapply" ] || [ "$1" = "-r" ]; then
        REAPPLY=true
        # Get last used configuration path
        if [ -f "$PARAM_HELPER" ]; then
            CONFIG_DIR=$(npx ts-node "$PARAM_HELPER" get-apply)
            if [ -z "$CONFIG_DIR" ]; then
                echo "Error: No saved configuration path found. Please run the command with a config directory path first."
                exit 1
            fi
            echo "Using saved configuration path: $CONFIG_DIR"
        else
            echo "Error: Parameter helper not found. Cannot use --reapply option."
            exit 1
        fi
    else
        CONFIG_DIR="$1"
    fi
else
    echo "Error: Too many arguments"
    show_usage
    exit 1
fi

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

# Save configuration path for future use (only if not using --reapply)
if [ "$REAPPLY" = false ] && [ -f "$PARAM_HELPER" ]; then
    npx ts-node "$PARAM_HELPER" save-apply "$CONFIG_DIR"
    echo "Configuration path saved for future reapplication."
fi

echo "Configuration applied successfully!"
exit 0

