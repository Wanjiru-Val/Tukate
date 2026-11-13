#!/usr/bin/env bash
# Runs the database rule tests against a throwaway local Postgres database.
# Usage: PGURL=postgres://user@host/postgres supabase/tests/run.sh
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
admin="${PGURL:-postgres://postgres@localhost:5432/postgres}"
db="tukate_test_$$"
psql "$admin" -q -c "create database $db"
target="${admin%/*}/$db"
trap 'psql "$admin" -q -c "drop database if exists $db with (force)"' EXIT
psql "$target" -q -v ON_ERROR_STOP=1 -f "$here/00_supabase_stub.sql"
psql "$target" -q -v ON_ERROR_STOP=1 -f "$here/../migrations/0001_core.sql"
psql "$target" -q -v ON_ERROR_STOP=1 -f "$here/../migrations/0003_privacy_and_abuse.sql"
psql "$target" -v ON_ERROR_STOP=1 -f "$here/01_rules.sql" 2>&1 | grep -E "ok  |FAIL|ERROR|PASSED" 
