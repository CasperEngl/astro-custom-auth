FROM oven/bun:latest AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y build-essential curl vim && \
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
  apt-get install -y nodejs

COPY . .

RUN bun install --production
RUN bun run build

EXPOSE $PORT

CMD bun ./dist/server/entry.mjs
