# Step 1: Use official Node.js image
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend/ ./

# Step 2: Expose the server on port 3000
EXPOSE 5000

# Step 3: Run the server
CMD ["npm", "start"]
