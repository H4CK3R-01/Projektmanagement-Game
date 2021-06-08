FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY Webservice Webservice
COPY public public
COPY data data

EXPOSE 5000

CMD [ "node", "Webservice/server.js" ]
