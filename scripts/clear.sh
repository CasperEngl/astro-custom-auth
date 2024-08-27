#!/bin/bash

rm sqlite.db
bunx drizzle-kit generate
bunx drizzle-kit migrate
