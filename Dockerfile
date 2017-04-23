FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm install -g forever
# Bundle app source
COPY ./build /usr/src/app
RUN rm -f config.json
EXPOSE 3000
CMD [ "forever", "server.js" ]