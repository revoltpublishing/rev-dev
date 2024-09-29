# Base image
FROM node:22.9.0
WORKDIR /backend/app

COPY package*.json ./
RUN npm install --verbose --no-interaction
# RUN npx prisma generate 
COPY . .
RUN ls -la
RUN npx prisma generate --schema=prisma/schema.prisma 

RUN npm run build --verbose --no-interaction

CMD [ "node", "dist/main.js" ]
