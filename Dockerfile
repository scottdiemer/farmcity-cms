FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
COPY --from=builder /app/keystone.ts ./keystone.ts
COPY --from=builder /app/schema.ts ./schema.ts
COPY --from=builder /app/schema.prisma ./schema.prisma
COPY --from=builder /app/.keystone ./.keystone
COPY --from=builder /app/generated ./generated

EXPOSE 3000
CMD ["npm", "run", "start"]
