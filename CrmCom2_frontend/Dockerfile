FROM node:12

RUN npm install -g @quasar/cli
RUN apt-get update
RUN apt-get install bash nmap procps -y

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

#RUN quasar build

COPY . .

EXPOSE 8888:8888

CMD [ "quasar", "dev" ]


