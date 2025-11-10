# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (for build caching)
COPY package*.json ./

# Configure npm for slow networks and retry automatically
RUN npm ci --prefer-offline --no-audit

# Install dependencies
RUN npm install

# Copy the rest of your application
COPY . .

# Expose the app port
EXPOSE 3000

# Run the app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
