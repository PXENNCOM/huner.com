# ==========================================
# BACKEND DOCKERFILE - Huner.com
# ==========================================
# Bu dosyayı backend/ klasörüne "Dockerfile" adıyla kaydedin

# Node.js Alpine imajı (hafif ve güvenli)
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Güvenlik: root olmayan kullanıcı oluştur
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Package dosyalarını kopyala
COPY package*.json ./

# Production bağımlılıklarını yükle
RUN npm ci --only=production && \
    npm cache clean --force

# Tüm kaynak kodları kopyala
COPY --chown=nodejs:nodejs . .

# Uploads klasörlerini oluştur
RUN mkdir -p uploads/profile-photos uploads/project-images uploads/temp && \
    chown -R nodejs:nodejs uploads/ && \
    chmod -R 755 uploads/

# Root olmayan kullanıcıya geç
USER nodejs

# Health check ekle
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Port 3001'i aç
EXPOSE 3001

# Uygulamayı başlat
CMD ["node", "server.js"]