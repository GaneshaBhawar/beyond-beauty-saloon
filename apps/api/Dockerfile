FROM node:20-alpine AS base
RUN npm install -g pnpm

WORKDIR /app
COPY pnpm-workspace.yaml package.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN pnpm install --frozen-lockfile=false
WORKDIR /app/apps/api
RUN pnpm db:generate
RUN pnpm build

EXPOSE 4000
CMD ["pnpm", "start"]
