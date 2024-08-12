# FROM node:20-alpine

# WORKDIR /app/frontend/

# COPY package*.json /app/frontend/
# RUN npm install

# COPY . /app/frontend/

# CMD ["npm", "start"]

FROM node:20-alpine

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]

