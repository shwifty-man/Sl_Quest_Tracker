FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json first (to leverage caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose API port (if needed)
EXPOSE 4000

# Default command
CMD ["npm", "run", "dev"]