# этап сборки (build stage)
FROM node:15-alpine as build-stage
WORKDIR /app
RUN ln -f -s .env.dev .env
COPY package*.json ./
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++
RUN npm install
COPY . .
COPY ./config/dubaicoins.vip/config.json ./config
RUN npm run build


# этап production (production-stage)
FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.template
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD sh -c "envsubst \"`env | awk -F = '{printf \" \\\\$%s\", $1}'`\" < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
