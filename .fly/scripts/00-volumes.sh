if [ ! -d "/data" ]; then
  mkdir -p /data
fi

if [ ! -f "/data/sqlite.db" ]; then
  touch /data/sqlite.db
fi
