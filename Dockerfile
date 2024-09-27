# Base image
FROM node:22.9.0

# Create app directory
WORKDIR /backend/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build
RUN npx prisma generate 
RUN npx prisma db push

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
