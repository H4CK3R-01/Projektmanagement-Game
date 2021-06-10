FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY Webservice Webservice
COPY public public
COPY data data

RUN sed -i "s/DATE_TO_BE_REPLACED/$(date +%s)/" public/index.html
RUN sed -i "s/COMMIT_TO_BE_REPLACED/GitHub: $(git ls-remote https://github.com/H4CK3R-01/Projektmanagement-Game refs/heads/main | awk '{print $1;}' | cut -c1-7)/" public/index.html
RUN sed -i "s/COMMIT_LINK_TO_BE_REPLACED/https\:\/\/github.com\/H4CK3R-01\/Projektmanagement-Game\/commit\/$(git ls-remote https://github.com/H4CK3R-01/Projektmanagement-Game refs/heads/main | awk '{print $1;}')/" public/index.html

EXPOSE 5000

CMD [ "node", "Webservice/server.js" ]
