# define the base image, in node application it should be node
FROM node:18-alpine 

# RUN is used to execute commands in a Linux container
RUN mkdir -p /home/expense-tracker

WORKDIR /home/expense-tracker

# copy package.json first refer https://docs.docker.com/build/guide/layers/#update-the-instruction-order
COPY ./package.json ./

# install packages in container
RUN npm install

# Copy contents of the project directory to the working directory of the container
COPY . .

# defines entry point command. So when docker runs the image, it runs this command
CMD ["npm", "start"]