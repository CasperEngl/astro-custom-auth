FROM oven/bun:latest AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y build-essential curl vim

COPY . .

RUN bun install --production
RUN bun run build

EXPOSE $PORT

CMD bun ./dist/server/entry.mjs
