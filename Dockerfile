FROM node:16.16

WORKDIR app

COPY package*.json ./
RUN npm install --force
#COPY . .

CMD ["npm", "start"]