FROM alpine
RUN apk add --update nodejs npm
COPY . /src
WORKDIR /src
RUN npm install
EXPOSE 4040
ENTRYPOINT ["node", "./server.js"]
