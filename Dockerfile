FROM node:26-alpine3.23

WORKDIR /app

RUN apk update && apk upgrade --no-cache libcrypto3 libssl3

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
