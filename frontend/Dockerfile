# Use an official Node.js runtime as a parent image
FROM node:20.16.0 as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Stage 2 - Serve the app with NGINX
FROM nginx:alpine

# Copy the build output to the NGINX web root
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Command to start NGINX
CMD ["nginx", "-g", "daemon off;"]
