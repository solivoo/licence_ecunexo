# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.22.0 --activate

COPY ecunexo_license/package.json ecunexo_license/pnpm-lock.yaml ecunexo_license/pnpm-workspace.yaml ./
COPY ecunexo_license/scripts ./scripts
RUN pnpm install --frozen-lockfile

COPY ecunexo_license/ ./
ARG VITE_API_BASE_URL
ARG VITE_LICENCE_SYNCFUSION=
ARG VITE_LOGNERD_ENABLE_CONSOLE=false
ARG VITE_LOGNERD_LEVEL=WARN
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_LICENCE_SYNCFUSION=$VITE_LICENCE_SYNCFUSION \
    VITE_LOGNERD_ENABLE_CONSOLE=$VITE_LOGNERD_ENABLE_CONSOLE \
    VITE_LOGNERD_LEVEL=$VITE_LOGNERD_LEVEL
RUN pnpm build

FROM nginx:1.27-alpine AS final
COPY deploy/nginx-spa.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
