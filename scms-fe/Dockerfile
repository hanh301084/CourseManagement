# Example Dockerfile for a Node.js application
# FROM node:latest

# WORKDIR /app
# COPY package*.json ./
# RUN npm install --force
# COPY . .

# EXPOSE 3000
# CMD ["npm", "start"]

# Step 1: Build the React application
FROM node:latest as build

WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Step 2: Serve the build with Nginx
FROM nginx:alpine

# Copy the build from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx when the container has provisioned.
CMD ["nginx", "-g", "daemon off;"]

