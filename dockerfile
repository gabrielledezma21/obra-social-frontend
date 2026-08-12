FROM node:20-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

ARG VITE_API_URL=https://medintegral-api.vercel.app
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_ENVIRONMENT=production

RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
