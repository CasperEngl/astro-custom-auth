FROM oven/bun:latest AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y build-essential curl vim sqlite3 && \
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
  apt-get install -y nodejs

COPY . .

RUN bun install
RUN bun --bun run build

ENV HOST 0.0.0.0
EXPOSE $PORT

CMD bun ./dist/server/entry.mjs
