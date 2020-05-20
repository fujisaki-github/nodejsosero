FROM node:14

#USER root
ENV CHAT=/home/app/chat
COPY . $CHAT/
WORKDIR $CHAT
#RUN npm init -y
#RUN npm install socket.io
RUN npm install
RUN npm install socket.io-client
CMD ["node", "app.js"]





#RUN useradd --user-group --create-home --shell /bin/false app && npm install --global npm@3.7.5

#ENV HOME=/home/app

#COPY package.json npm-shrinkwrap.json $HOME/chat/
#RUN chown -R app:app $HOME/*

#USER app
#WORKDIR $HOME/chat
#RUN npm install

#USER root
#COPY . $HOME/chat
#RUN chown -R app:app $HOME/*
#USER app

#CMD ["node", "index.js"]