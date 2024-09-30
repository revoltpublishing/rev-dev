FROM node:20-alpine AS builder
WORKDIR /app

# Install additional packages needed for build
RUN apk add --no-cache \
  g++ \
  make \
  python3 \
  bash

COPY package*.json ./
RUN npm cache clean --force
RUN npm install --verbose --no-interaction

# Ensure the Prisma schema is available
COPY . .
RUN npm run build:tsc --verbose --no-interaction || { cat /root/.npm/_logs/*.log; exit 1; }
RUN npx prisma generate --schema=prisma/schema.prisma
# Run build with fallback to output logs in case of error
RUN npm run build --verbose --no-interaction || { cat /root/.npm/_logs/*.log; exit 1; }

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD [ "node", "dist/main.js" ]
