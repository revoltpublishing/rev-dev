# Base image
FROM node:22.9.0
WORKDIR /backend/app

COPY package*.json ./
RUN npm install --verbose
# RUN npx prisma generate 
COPY . .
RUN ls -la
RUN npx prisma generate --schema=prisma/schema.prisma

RUN npm run build --verbose

CMD [ "node", "dist/main.js" ]
