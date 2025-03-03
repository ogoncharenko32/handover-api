FROM node:20

WORKDIR /app

COPY package*.json ./

RUN yarn --ignore-platform

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "start"]

