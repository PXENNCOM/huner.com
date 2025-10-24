# ==========================================
# FRONTEND DOCKERFILE - Huner.com
# ==========================================

# --------- BUILD AŞAMASI ---------
FROM node:18-alpine as build

WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# TÜM bağımlılıkları yükle (build için devDependencies gerekli)
RUN npm ci

# Tüm kaynak kodları kopyala
COPY . .

# API URL'ini build zamanında ayarla
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Production build yap
RUN npm run build

# --------- PRODUCTION AŞAMASI ---------
FROM nginx:alpine

# Özel Nginx yapılandırmasını kopyala
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build edilmiş dosyaları Nginx'e kopyala
COPY --from=build /app/dist /usr/share/nginx/html

# Port 80'i aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]