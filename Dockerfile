# define the base image, in node application it should be node
FROM node:18-alpine 
# define firebase func url, while building image we need to send value of this variable
ARG FIREBASE_FUNC_URL
# set up env variables
ENV REACT_APP_BASE_URL=$FIREBASE_FUNC_URL

# RUN is used to execute commands in a Linux container
RUN mkdir -p /home/expense-tracker

# Copy contents of the project directory to the /home/node-app directory of the container
COPY ./public /home/expense-tracker/public
COPY ./src /home/expense-tracker/src
COPY ./package.json /home/expense-tracker/package.json
COPY ./tailwind.config.js /home/expense-tracker/tailwind.config.js

# install packages in container
WORKDIR /home/expense-tracker
RUN npm install

# defines entry point command. So when docker runs the image, it runs this command
CMD ["npm", "start"]