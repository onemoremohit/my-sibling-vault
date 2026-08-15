# Use official lightweight Node.js 20 Alpine image
FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Set working directory
WORKDIR /usr/src/app

# Copy package manifests first for optimal layer caching
COPY package*.json ./

# Install production dependencies deterministically
RUN npm ci --only=production && npm cache clean --force

# Copy application source code
COPY . .

# Ensure uploads directory exists and set correct permissions for non-root 'node' user
RUN mkdir -p uploads && chown -R node:node /usr/src/app

# Switch to non-root user for security
USER node

# Expose dynamic container port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start the Express production server
CMD ["npm", "start"]
