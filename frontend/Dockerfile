# Use official Node.js image
FROM node:22-alpine

# Accept a custom npm registry (useful for CI mirrors or proxies)
ARG NPM_REGISTRY=https://registry.npmjs.org/
ENV NPM_CONFIG_REGISTRY=$NPM_REGISTRY \
	NPM_CONFIG_FETCH_TIMEOUT=600000 \
	NPM_CONFIG_FETCH_RETRIES=5 \
	NPM_CONFIG_LOGLEVEL=warn

# Set working directory
WORKDIR /app

# Copy only package files first (for build caching)
COPY package.json package-lock.json ./

# Install dependencies with lockfile for reproducible and faster CI builds
RUN npm ci --no-audit --no-fund

# Copy the rest of your application
COPY . .

# Expose the app port (configured in vite.config.js)
EXPOSE 3000

# Run the app (dev server bound to 0.0.0.0 for container access)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
