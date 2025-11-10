FROM node:22-alpine

ARG NPM_REGISTRY=https://registry.npmjs.org/
ENV NPM_CONFIG_REGISTRY=$NPM_REGISTRY \
	NPM_CONFIG_FETCH_TIMEOUT=600000 \
	NPM_CONFIG_FETCH_RETRIES=5 \
	NPM_CONFIG_LOGLEVEL=warn

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production --no-audit --no-fund

COPY . .

EXPOSE 4000
CMD ["node", "index.js"]
