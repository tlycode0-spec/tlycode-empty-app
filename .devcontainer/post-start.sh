#!/bin/bash

# Start tlycode-agent server
#if ! pgrep -f "tlycode-agent-server" > /dev/null 2>&1; then
#  echo "Starting tlycode-agent-server..."
#  /workspace/tlycode-agent-server &
#fi

# Start tlycode-agent server
/workspaces/tlycode-agent-server-linux-amd64 --port 3005