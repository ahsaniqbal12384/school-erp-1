#!/bin/bash

# Run Supabase migration script
# Usage: ./run_migration.sh <migration_file>

MIGRATION_FILE=$1
PROJECT_REF="aczutdvzatjmsoybgmgk"
ACCESS_TOKEN="sbp_a2ea04996a4ea32ce4a72031254d0599a4d0f83f"

if [ -z "$MIGRATION_FILE" ]; then
    echo "Usage: $0 <migration_file>"
    exit 1
fi

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "File not found: $MIGRATION_FILE"
    exit 1
fi

echo "Running migration: $MIGRATION_FILE"

# Read file and escape for JSON
SQL_CONTENT=$(cat "$MIGRATION_FILE")

# Create a temporary file with the JSON payload
TMP_FILE=$(mktemp)
python3 -c "
import json
import sys

with open('$MIGRATION_FILE', 'r') as f:
    sql = f.read()

payload = {'query': sql}
print(json.dumps(payload))
" > "$TMP_FILE"

# Run the migration
RESULT=$(curl -s -X POST \
  "https://api.supabase.com/v1/projects/$PROJECT_REF/database/query" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @"$TMP_FILE" 2>&1)

rm "$TMP_FILE"

# Check result
if echo "$RESULT" | grep -q "message"; then
    echo "Error: $RESULT"
    exit 1
else
    echo "Migration successful!"
    echo "$RESULT"
fi
