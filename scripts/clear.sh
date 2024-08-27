#!/bin/bash

rm data/sqlite.db
bunx drizzle-kit generate
bunx drizzle-kit migrate
