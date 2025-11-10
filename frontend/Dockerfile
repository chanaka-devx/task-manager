# 1) Builder stage: install deps and build static assets
FROM node:22-alpine AS builder

WORKDIR /app

# Optional proxy args (passed from Jenkins if present)
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}
ENV NO_PROXY=${NO_PROXY}

# Copy only package files first for better layer caching
COPY package*.json ./

# NPM config tuned for slow or flaky networks
RUN npm config set registry https://registry.npmjs.org/ \
 && npm config set fetch-retries 6 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set fetch-timeout 600000 \
 && npm config set network-timeout 600000 \
 && npm config set fund false \
 && npm config set audit false

# Prefer reproducible installs; fall back to npm install if no lockfile
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source and build
COPY . .
RUN npm run build

# 2) Runtime stage: serve static files with nginx
FROM nginx:alpine AS runtime

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Minimal nginx config (optional: could add gzip, caching headers later)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
