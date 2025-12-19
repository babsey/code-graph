FROM node:lts-alpine AS build-stage

# install simple http server for serving static content and yarn
RUN npm install -g yarn --force

# make the 'app' folder the current working directory
WORKDIR /app

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# install project dependencies
RUN yarn install

# build app for production with minification
RUN yarn build-only

RUN npm link

WORKDIR examples/code-graph-store/

# install project dependencies
RUN yarn install

# # TODO: temporary solution for the issue that nodes are not positioned in graph in the production.
# EXPOSE 80
# CMD ["yarn", "dev", "--host", "--port", "80"]

RUN npm link @babsey/code-graph

# build app for production with minification
RUN yarn build-only

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/examples/code-graph-store/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]