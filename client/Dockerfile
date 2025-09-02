# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# CRA build outputs to /app/build
RUN npm run build

# ---- serve stage ----
FROM nginx:stable-alpine
# Serve CRA build
COPY --from=build /app/build /usr/share/nginx/html
# Our nginx.conf is mounted by compose (see deploy/)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
