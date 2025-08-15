FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy server code
COPY . .

# Env + port
ENV PORT=5000
EXPOSE 5000

# Make sure backend/package.json has:
# "scripts": { "start": "node server.js" }
CMD ["npm","start"]
