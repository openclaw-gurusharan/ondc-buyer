#!/bin/bash
# health-check.sh - ONDC UCP Buyer Portal
#
# Purpose: Fast health diagnosis - show the problem immediately
#
# Exit codes: 0 = healthy, 1 = broken, 2 = timeout

set -e

FRONTEND_PORT=3000
ISSUES_FOUND=0

echo "=== Health Check ==="

# ============================================================================
# Check infrastructure
# ============================================================================

check_infrastructure() {
  echo ""
  echo "Checking infrastructure..."

  # Disk space
  local disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
  if [ "$disk_usage" -gt 90 ]; then
    echo "✗ Disk space critically low: ${disk_usage}% used" >&2
    echo "Fix: Run 'docker system prune' or clean up node_modules" >&2
    ISSUES_FOUND=1
  elif [ "$disk_usage" -gt 80 ]; then
    echo "⚠ Disk space warning: ${disk_usage}% used" >&2
  else
    echo "✓ Disk space OK (${disk_usage}% used)"
  fi

  # Environment file
  echo ""
  echo "Checking environment files..."

  if [ ! -f ".env" ]; then
    echo "✗ Missing: .env" >&2
    ISSUES_FOUND=1
  else
    if grep -qE "REPLACE_ME|your_key_here|TODO" ".env" 2>/dev/null; then
      echo "⚠ .env has unset placeholder values" >&2
    fi
    echo "✓ .env exists"
  fi

  # Node modules
  if [ ! -d "node_modules" ]; then
    echo "✗ node_modules missing - run: npm install" >&2
    ISSUES_FOUND=1
  else
    echo "✓ node_modules exists"
  fi

  if [ $ISSUES_FOUND -eq 1 ]; then
    echo "" >&2
    echo "❌ Infrastructure check FAILED" >&2
    exit 1
  fi
}

check_infrastructure

# ============================================================================
# Check Vite dev server
# ============================================================================

echo ""
echo "Checking services..."

check_service() {
  local url=$1
  local name=$2

  if curl -sf --max-time 2 "$url" > /dev/null 2>&1; then
    echo "✓ $name"
    return 0
  fi

  echo "✗ $name is NOT responding" >&2

  # Check process
  if pgrep -f "vite" >/dev/null 2>&1; then
    echo "  Process 'vite' is running but not responding on port $FRONTEND_PORT" >&2
  else
    echo "  Process 'vite' is NOT running" >&2
  fi

  echo "" >&2
  echo "Fix: npm run dev" >&2
  echo "Or:   ./.claude/scripts/restart-servers.sh" >&2

  return 1
}

if ! check_service "http://localhost:$FRONTEND_PORT" "Vite Dev Server"; then
  echo "" >&2
  echo "❌ Health check FAILED" >&2
  exit 1
fi

# ============================================================================
# MCP servers (optional)
# ============================================================================

echo ""
echo "Checking MCP servers..."

MCP_RUNNING=0
if pgrep -f "token-efficient-mcp" >/dev/null 2>&1; then
  echo "✓ token-efficient-mcp running"
  MCP_RUNNING=1
fi

if pgrep -f "context-graph-mcp" >/dev/null 2>&1; then
  echo "✓ context-graph-mcp running"
  MCP_RUNNING=1
fi

if [ $MCP_RUNNING -eq 0 ]; then
  echo "⚠ No MCP servers detected (may be OK)" >&2
fi

# ============================================================================
# Final result
# ============================================================================

echo ""
echo "✅ All systems healthy"
exit 0
