# Stage 1: Build the Angular app
FROM node:18 AS build
WORKDIR /app

# Mühit dəyişənini build prosesinə ötürürük
ARG NG_APP_SPOONACULAR_API_KEY
ENV NG_APP_SPOONACULAR_API_KEY=$NG_APP_SPOONACULAR_API_KEY

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# build-dən sonra yaranan faylları Nginx serverinə kopyalayırıq
COPY --from=build /app/dist/food-recipe /usr/share/nginx/html
# Nginx konfiqurasiyasını əlavə edirik
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80