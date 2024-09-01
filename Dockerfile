FROM node:20 AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y build-essential curl vim sqlite3
RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:$PATH"

COPY . .


RUN bun install
RUN bun run build
RUN mkdir -p data && touch data/sqlite.db
# RUN bun run migrate

ENV HOST 0.0.0.0
EXPOSE $PORT

CMD node ./dist/server/entry.mjs
