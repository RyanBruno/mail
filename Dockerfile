FROM node:10.5.0-alpine

EXPOSE 25

WORKDIR /home/node/app
COPY daemon/ .

CMD npm start
