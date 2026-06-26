#!/usr/bin/env bash
set -e

API_URL="${API_URL:-http://localhost:5235/api}"
PASS=0
FAIL=0

check() {
  local desc="$1"
  local url="$2"
  local method="${3:-GET}"
  local data="$4"
  local expected_code="${5:-200}"
  local token="$6"

  local args=(-s -o /dev/null -w "%{http_code}" -X "$method")

  if [ -n "$data" ]; then
    args+=(-H "Content-Type: application/json" -d "$data")
  fi

  if [ -n "$token" ]; then
    args+=(-H "Authorization: Bearer $token")
  fi

  local code
  code=$(curl "${args[@]}" "$url")

  if [ "$code" = "$expected_code" ]; then
    echo "PASS: $desc (HTTP $code)"
    PASS=$((PASS + 1))
  else
    echo "FAIL: $desc (expected $expected_code, got $code)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== FormForge Integration Tests ==="
echo "API: $API_URL"
echo ""

check "Health Check" "$API_URL/health"

check "Register" "$API_URL/auth/register" POST \
  '{"email":"test-ci@formforge.com.tr","password":"test123456","name":"CI Test"}' 201

TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@formforge.com.tr","password":"demo123456"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "WARN: Could not get token, skipping authenticated tests"
else
  check "Login" "$API_URL/auth/login" POST \
    '{"email":"demo@formforge.com.tr","password":"demo123456"}' 200

  check "Profile" "$API_URL/auth/profile" GET "" 200 "$TOKEN"

  check "List Forms" "$API_URL/forms" GET "" 200 "$TOKEN"

  check "Dashboard Stats" "$API_URL/users/dashboard-stats" GET "" 200 "$TOKEN"

  check "Global Analytics" "$API_URL/analytics/global" GET "" 200 "$TOKEN"

  check "Notifications" "$API_URL/notifications" GET "" 200 "$TOKEN"
fi

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="

exit 0
