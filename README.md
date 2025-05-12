# DNS Configuration Tools

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

Generates domain configurations from a JSON config file.

```bash
npx ts-node src/configure-domain-files -o "PATH_TO_CONFIG" -i IP_ADDRESS
```

Options:

- `-o`: Path to configuration file (required)
- `-i`: IP address for host entries (default: "localhost")

Example configuration file:

```json
{
  "app": "myapp",
  "platforms": ["local", "dev"],
  "subdomains": [
    {
      "subdomain": "example.com",
      "creditUnions": ["cu1", "cu2"]
    }
  ]
}
```

### Bash Utilities (`src/bash-utils/`)

#### Apply Domain Configuration

```bash
bash src/bash-utils/apply-domain-config.sh PATH_TO_CONFIG
```

- Applies generated configuration to Nginx and hosts file
- Creates backups in `backups/` directory
- Requires sudo privileges

#### Remote Execution

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/homecu/configure-dns/refs/heads/main/src/bash-utils/UTIL_NAME)"
```

#### Local Execution

```bash
/bin/bash -c "./bash-utils/UTIL_NAME"
```

## Troubleshooting

If configuration changes don't take effect:

1. Check file permissions
2. Restart Nginx: `sudo nginx -s reload`
3. Check backup files in case of rollback needs
