# Base image
FROM node:22.9.0
WORKDIR /backend/app

COPY package*.json ./
RUN npm install
# RUN npx prisma generate 
RUN npx prisma generate --schema= prisma/schema.prisma
COPY . .

RUN npm run build --no-interaction

CMD [ "node", "dist/main.js" ]
