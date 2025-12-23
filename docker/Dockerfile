FROM node:lts-alpine AS build-stage

# install simple http server for serving static content and yarn
RUN npm install -g yarn --force

# make the 'app' folder the current working directory
WORKDIR /app

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

WORKDIR examples/code-graph-store

# install project dependencies
RUN yarn install

# build app for production with minification
RUN yarn build-only

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/examples/code-graph-store/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]