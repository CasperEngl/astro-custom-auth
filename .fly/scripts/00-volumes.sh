if [ ! -d "/app/data" ]; then
  mkdir -p /app/data
fi

if [ ! -f "/app/data/sqlite.db" ]; then
  touch /app/data/sqlite.db
fi
