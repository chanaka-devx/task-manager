# Use official Node.js image
FROM node:22-alpine

# working directory
WORKDIR /app

# Copy only package files first (for build caching)
COPY package.json package-lock.json ./

# Install dependencies with lockfile for reproducible and faster CI builds
RUN npm ci --no-audit --no-fund

# Copy the rest of your application
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Run the app (dev server bound to 0.0.0.0 for container access)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]