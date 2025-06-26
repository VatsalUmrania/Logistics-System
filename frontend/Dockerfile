# Step 1: Use official Node.js image to build the app
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend code
COPY frontend/ ./

# Build the app for production
RUN npm run build

# Step 2: Serve the production build using a lightweight HTTP server (like Nginx)
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the app
EXPOSE 80

# Run Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
