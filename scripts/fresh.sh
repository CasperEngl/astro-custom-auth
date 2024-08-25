#!/bin/bash

rm -rf sqlite.db src/db/migrations
bunx drizzle-kit generate
bunx drizzle-kit migrate
