# select base node image
FROM node:20-alpine

# set working directory
workdir /app

# copy app dependencies
copy /nodejs-open-redirect-1.0.0.tgz .

# install dependencies from tar file
run npm install nodejs-open-redirect-1.0.0.tgz

# copy source code
copy . .

# check whether original package.json is the same as 
RUN diff package.json node_modules/nodejs-open-redirect/package.json || exit 1

# move to proper file structure
RUN mv node_modules/nodejs-open-redirect/node_modules/* node_modules

# remove leftover files and
run rm -r node_modules/nodejs-open-redirect
run rm nodejs-open-redirect-1.0.0.tgz

# change user to non root but not that important in dev environent
USER node

# run container
CMD ["sleep", "1d"]