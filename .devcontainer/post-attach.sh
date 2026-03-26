#!/bin/bash

# Show vibe-kanban URL
if [ -n "$CODESPACE_NAME" ]; then
  VK_URL="https://${CODESPACE_NAME}-3005.app.github.dev/"
  echo ""
  echo "╔══════════════════════════════════════════════════════════════════╗"
  echo "║  Code space is ready!                                            ║"
  echo "║                                                                  ║"
  echo "║  Now you can run Claude as a plugin in VS Code or in the command ║"    
  echo "║  line using the claude command.                                  ║"
  echo "║                                                                  ║"
  echo "╚══════════════════════════════════════════════════════════════════╝"
  echo ""
fi
