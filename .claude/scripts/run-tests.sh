#!/bin/bash
# run-tests.sh - ONDC UCP Buyer Portal test runner
# Usage: ./run-tests.sh

set -e

EVIDENCE_DIR="/tmp/test-evidence"
TIMESTAMP=$(date +%s)
mkdir -p "$EVIDENCE_DIR"

echo "=== Running Tests ==="
echo ""
echo "1. Type check (tsc)..."
if npm run typecheck 2>&1 | tee "$EVIDENCE_DIR/typecheck-$TIMESTAMP.log"; then
  echo "✓ Type check passed"
else
  echo "✗ Type check failed"
  exit 1
fi

echo ""
echo "2. Unit tests (vitest)..."
if npm run test 2>&1 | tee "$EVIDENCE_DIR/vitest-$TIMESTAMP.log"; then
  echo "✓ Tests passed"
else
  echo "✗ Tests failed"
  exit 1
fi

echo ""
echo "✅ All checks passed"
exit 0
