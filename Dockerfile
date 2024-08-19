#inicia con la imagen base que contiene Java runtime
FROM node:lts-bullseye as build
WORKDIR /app
# se cambia el jar del microservicio a imagen
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

FROM nginx:alpine
ADD ./config/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/jedank-security/browser /var/www/app/
#COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
