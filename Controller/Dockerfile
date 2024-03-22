#select base image
FROM node:20-alpine

# set working directory, if /app does not exist in base image, /app will be created and set as directory
WORKDIR /

# copy app dependencies from the current nodejs folder i am in
COPY package.json .

# install from npm
RUN npm install

# copy folders
COPY . .

# create non-root user
RUN adduser -D defaultuser

# switch to non-root user
USER defaultuser

# start app after container runs
CMD ["node","app.js"]
