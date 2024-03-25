#select base image
FROM node:20-alpine

# create non-root user
RUN adduser -u 1001 -D defaultuser

# switch to non-root user
USER defaultuser

# set working directory, if /app does not exist in base image, /app will be created and set as directory
WORKDIR /app

# copy app dependencies from the current nodejs folder i am in
COPY package.json .

# install from npm
RUN npm install

# copy folders
COPY . .

#change permission
#RUN chmod u=rwx,go=x app.js



# start app after container runs
CMD ["node","app.js"]