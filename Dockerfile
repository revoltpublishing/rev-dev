FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --verbose --no-interaction
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build --verbose --no-interaction

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD [ "node", "dist/main.js" ]