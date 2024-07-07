# syntax=docker/dockerfile:1
# using the node image as a base, with Node.js 18 installed
# alpine is a lightweight version of the image, results in a small container size
# great for production environments
FROM node:18-alpine

# setting the NODE_ENV environment variable to production
# this is a best practice for production environments
ENV NODE_ENV=production

# setting the working directory to /app
# this is where the application code will live

WORKDIR /app
# copying the package.json and package-lock.json files to the working directory
# this is done before copying the rest of the application code
COPY ./package*.json ./
COPY ./packages/settings-api ./packages/settings-api
# run npm ci to install the dependencies
# the --omit=dev flag is used to exclude the devDependencies from the installation
#--workspace=settings-api is used to specify the workspace to install the dependencies for
#--cache /tmp/empty-cache is used to specify an empty cache directory
# good practice to use a cache directory to speed up the build process
RUN npm ci --omit=dev --workspace=settings-api --cache /tmp/empty-cache
# our container will listen on port 4001
EXPOSE 4001

CMD [ "npm", "start", "--workspace=settings-api" ]
