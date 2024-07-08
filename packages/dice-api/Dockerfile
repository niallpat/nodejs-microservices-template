# syntax=docker/dockerfile:1

# Build Node.js app
# ------------------------------------
  # define a name for the stage, using the as keyword
  FROM node:18-alpine as build
  WORKDIR /app
  COPY ./package*.json ./
  COPY ./packages/dice-api ./packages/dice-api
  RUN npm ci --workspace=dice-api --cache /tmp/empty-cache
  #instead of running the start script using the CMD instruction, we run the build script.
  #this will build the application code and output the build artifacts to the dist directory
  RUN npm run build --workspace=dice-api

# Run Node.js app
# ------------------------------------
  FROM node:18-alpine
  ENV NODE_ENV=production

  WORKDIR /app
  COPY ./package*.json ./
  # we don't copy the source code to the image, we copy the build artifacts from the build stage
  COPY ./packages/dice-api/package.json ./packages/dice-api/
  #using the --omit=dev flag to exclude the devDependencies from the installation
  RUN npm ci --omit=dev --workspace=dice-api --cache /tmp/empty-cache
  #copying the build artifacts from the build stage to the image
  COPY --from=build app/packages/dice-api/dist packages/dice-api/dist
  EXPOSE 4002
  CMD [ "npm", "run", "start:prod", "--workspace=dice-api" ]

  #Docker will first create a container to build our app
  #then it will create a new container where we copy the compiled app code from the first container to run the app
