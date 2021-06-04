FROM node:12-alpine

WORKDIR /src
COPY package.json package-lock.json  /src/

RUN npm i

COPY . /src
EXPOSE 8090

CMD ["node", "index.js"]