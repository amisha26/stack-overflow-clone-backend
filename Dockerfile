# Use Node 20 Alpine for a small footprint
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first to leverage Docker's cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Match this to your server's port
EXPOSE 3001

# Command to run the app (using the dev script from package.json)
CMD ["npm", "start"]