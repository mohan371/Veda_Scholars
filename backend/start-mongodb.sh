#!/bin/bash
# Script to start MongoDB manually (workaround for error 62 on macOS)

MONGODB_BIN="/opt/homebrew/opt/mongodb-community/bin/mongod"
MONGODB_CONFIG="/opt/homebrew/etc/mongod.conf"
MONGODB_LOG="/opt/homebrew/var/log/mongodb/mongo.log"

# Check if MongoDB is already running
if lsof -i :27017 > /dev/null 2>&1; then
    echo "✅ MongoDB is already running on port 27017"
    exit 0
fi

# Remove lock file if it exists
rm -f /opt/homebrew/var/mongodb/mongod.lock

# Start MongoDB in the background
echo "🚀 Starting MongoDB..."
nohup "$MONGODB_BIN" --config "$MONGODB_CONFIG" >> "$MONGODB_LOG" 2>&1 &

# Wait a moment and check if it started
sleep 2
if lsof -i :27017 > /dev/null 2>&1; then
    echo "✅ MongoDB started successfully on port 27017"
    echo "📝 Logs: $MONGODB_LOG"
else
    echo "❌ Failed to start MongoDB. Check logs: $MONGODB_LOG"
    exit 1
fi

