FROM oven/bun:latest AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y build-essential

COPY . .

RUN bun install --production
RUN bun run build

ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080
CMD bun ./dist/server/entry.mjs
