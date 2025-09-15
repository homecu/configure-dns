# DNS Configuration Tools

GUIDE ON NOTION: https://www.notion.so/blossom-net/Domains-and-SSL-configuration-207139a2ceab807483e0ea71d2272fde?source=copy_link

Collection of utilities to manage local DNS configuration and domain mapping for development environments.

## Overview

This toolkit provides:

- Domain configuration generator
- DNS configuration utilities
- Nginx configuration management
- Host file management

## Installation

```bash
git clone https://github.com/homecu/configure-dns.git
cd configure-dns
npm install
```

### Prerequisites

- **mkcert**: This tool is used to generate locally-trusted SSL certificates
  ```bash
  # On macOS
  brew install nginx
  brew install mkcert
  brew install nss
  # Initialize the local CA
  mkcert -install
  ```
  For other platforms, follow instructions at https://github.com/FiloSottile/mkcert

## Adding New Domains

Domains are configured in `src/configure-domain-files/configurations.ts`. The configuration consists of two main parts:

### 1. App Configuration

```typescript
{
  app: App.MEMBER,  // Application identifier
  port: 3006       // Local port for the application
}
```

### 2. Domain Configuration

```typescript
{
  app: App.MEMBER,                    // Must match an app configuration
  platforms: ["localmember"],         // Platform prefix for domains
  subdomains: [
    {
      creditUnions: ["wp", "bhcu"],  // Credit union identifiers (can be empty)
      subdomain: "blossombeta.com"   // Base domain
    }
  ]
}
```

### How Domains Are Generated

The domain generator combines these components to create URLs in the following format:

- With credit unions: `[platform].[creditUnion].[subdomain]`
- Without credit unions: `[platform].[subdomain]`

Examples:

- `localmember.wp.blossombeta.com`
- `localui.blossomdev.com`

To add a new domain:

1. Ensure the app exists in `appsConfig`
2. Add or modify an entry in `domainGeneratorConfigs`
3. Run the domain configuration generator

## Available Utilities

### Domain Configuration Generator (`src/configure-domain-files/`)

Generates domain configurations and stores those files on `PATH_TO_CONFIG` folder

```bash
npx ts-node src/configure-domain-files -o "PATH_TO_CONFIG" -i IP_ADDRESS
```

Options:

- `-o, --output`: Path to configuration file (required)
- `-i, --ip`: IP address for host entries (default: "127.0.0.1")
- `-r, --regenerate`: Use the last saved parameters to regenerate configuration

#### Regenerating with saved parameters

After running the command once, you can regenerate the configuration using the same parameters:

```bash
npx ts-node src/configure-domain-files --regenerate
# or use the short flag:
npx ts-node src/configure-domain-files -r
```

This will use the previously saved output path and IP address, making it easy to regenerate configurations without remembering the exact parameters.

### Bash Utilities (`src/bash-utils/`)

#### Apply Domain Configuration

```bash
bash src/bash-utils/apply-domain-config.sh PATH_TO_CONFIG
```

- Applies generated configuration to Nginx and hosts file
- Creates backups in `backups/` directory
- Requires sudo privileges

#### Reapplying with saved configuration path

After applying a configuration once, you can reapply using the same path:

```bash
bash src/bash-utils/apply-domain-config.sh --reapply
# or use the short flag:
bash src/bash-utils/apply-domain-config.sh -r
```

This will use the previously saved configuration path, eliminating the need to remember or locate the exact path used before.

#### Remote Execution

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/homecu/configure-dns/refs/heads/main/src/bash-utils/UTIL_NAME)"
```

#### Local Execution

```bash
/bin/bash -c "./bash-utils/UTIL_NAME"
```

## Quick Usage Examples

### First time setup:
```bash
# Generate configuration
npx ts-node src/configure-domain-files -o "/path/to/config" -i "127.0.0.1"

# Apply configuration
bash src/bash-utils/apply-domain-config.sh "/path/to/config"
```

### Subsequent usage (using saved parameters):
```bash
# Regenerate configuration with saved parameters
npx ts-node src/configure-domain-files --regenerate
# or: npx ts-node src/configure-domain-files -r

# Reapply configuration with saved path
bash src/bash-utils/apply-domain-config.sh --reapply
# or: bash src/bash-utils/apply-domain-config.sh -r
```

The tool automatically remembers your last used parameters, so you don't need to remember paths or settings between sessions.

## Troubleshooting

If configuration changes don't take effect:

1. Check file permissions
2. Restart Nginx: `sudo nginx -s reload`
3. Check backup files in case of rollback needs


# 🛠️ Environment Setup for Canvas Compatibility

This Bash script automates the setup of required dependencies to solve common issues when installing or running the canvas package in Node.js projects. It’s tailored for macOS and uses Homebrew to install necessary system libraries.

## 📄 What Does This Script Do?
1. Installs system-level dependencies required to compile canvas.
2. Creates and activates a Python virtual environment.
3. Upgrades pip and installs setuptools.
4. Verifies that setuptools is properly installed.
5. Switches to Node.js version 16.13.1 using nvm.
6. Starts your project using npm start.

## 📋 Prerequisites
Before running the script, ensure the following are installed on your system:

* Homebrew
* nvm (Node Version Manager)
* Python 3

## 🚀 How to Use
1. Download or create the script file.
Save the script as configCanvas.sh. For example, on your Desktop:
~/Desktop/configCanvas.sh

2. Make the script executable (only needed once):
chmod +x ~/Desktop/configCanvas.sh

3. Run the script:
~/Desktop/configCanvas.sh

4. Note: Replace {{path/to/venv}} in the script with your actual virtual environment path before running it. For example:
python3 -m venv ~/my-venvs/canvas-env
source ~/my-venvs/canvas-env/bin/activate


## 🧩 Why This Script?
Installing the canvas package can fail if your system is missing native dependencies or if the Node.js version is incompatible. This script streamlines the setup process to ensure that your development environment is ready to use canvas without manual troubleshooting.

## 🧼 Tip: Clean Installation
If you’ve previously had issues with canvas, consider removing your node_modules and package-lock.json and reinstalling:
rm -rf node_modules package-lock.json
npm install