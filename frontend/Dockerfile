# ==========================================
# FRONTEND DOCKERFILE - Huner.com
# ==========================================

# --------- BUILD AŞAMASI ---------
FROM node:18-alpine as build

WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci --only=production

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

# Health check ekle
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Port 80'i aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]