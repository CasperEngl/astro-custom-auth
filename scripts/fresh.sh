#!/bin/bash

rm -rf data/sqlite.db src/db/migrations
bunx drizzle-kit generate
bunx drizzle-kit migrate
