# Base image
FROM node:22.9.0
WORKDIR /backend/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# RUN npx prisma generate 
# RUN npx prisma db push

CMD [ "node", "dist/main.js" ]
