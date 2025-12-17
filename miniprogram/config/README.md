# API Configuration

This directory contains configuration files for the API endpoints.

## Configuration File

The `api-config.ts` file contains the following settings:

- `REAL_DEVICE_IP`: The IP address of your computer when testing on real devices
- `PORT`: The port number for the API server
- `PRODUCTION_DOMAIN`: The domain name for production environment

## How to Configure

### For Computer Preview (DevTools)
- No changes needed, defaults to `localhost`

### For Real Device Testing
1. Find your computer's IP address
2. Update the `REAL_DEVICE_IP` value in `api-config.ts`

### For Production
1. Update the `PRODUCTION_DOMAIN` value in `api-config.ts`
2. Build the project for production

## Environment Detection Logic

The system automatically detects the environment:
- **DevTools**: Uses `localhost`
- **Real Device**: Uses the configured IP address
- **Fallback**: Uses `localhost` if detection fails