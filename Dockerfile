FROM node:21-alpine as base
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

FROM base as dev
ENV NODE_ENV=development
RUN npm install 
COPY . .
CMD npm run dev