FROM node:20-alpine

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install --registry=https://registry.npmjs.org/


COPY . .

CMD ["npm", "start"]

