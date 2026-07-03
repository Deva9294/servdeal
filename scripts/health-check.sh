#!/bin/bash
# ServDeal Health Check Script
# Monitors the health of deployed services

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
DB_CONNECTION_STRING="${MONGO_URI:-}"
TIMEOUT=5

# Counters
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}🏥 ServDeal Health Check${NC}"
echo "======================================"
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo "Time: $(date)"
echo ""

# Function to check HTTP endpoint
check_http() {
    local name=$1
    local url=$2
    local expected_code=$3
    
    echo -n "Checking $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓ OK ($response)${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED (Expected: $expected_code, Got: $response)${NC}"
        ((FAILED++))
    fi
}

# Function to check database connection
check_database() {
    echo -n "Checking MongoDB connection... "
    
    if [ -z "$DB_CONNECTION_STRING" ]; then
        echo -e "${YELLOW}⚠ SKIPPED (No connection string)${NC}"
        ((WARNINGS++))
        return
    fi
    
    # This is a simple check - in production you might use mongosh
    if [ ! -z "$DB_CONNECTION_STRING" ]; then
        echo -e "${GREEN}✓ Connection string configured${NC}"
        ((PASSED++))
    fi
}

# Function to check response time
check_response_time() {
    local name=$1
    local url=$2
    
    echo -n "Checking $name response time... "
    
    start_time=$(date +%s%N)
    curl -s -o /dev/null --connect-timeout $TIMEOUT "$url" 2>/dev/null
    end_time=$(date +%s%N)
    
    response_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ $response_time -lt 1000 ]; then
        echo -e "${GREEN}✓ ${response_time}ms${NC}"
        ((PASSED++))
    elif [ $response_time -lt 3000 ]; then
        echo -e "${YELLOW}⚠ ${response_time}ms (Slow)${NC}"
        ((WARNINGS++))
    else
        echo -e "${RED}✗ ${response_time}ms (Very Slow)${NC}"
        ((FAILED++))
    fi
}

# Function to check disk space
check_disk_space() {
    echo -n "Checking disk space... "
    
    available=$(df . | awk 'NR==2 {print $4}')
    total=$(df . | awk 'NR==2 {print $2}')
    used=$(df . | awk 'NR==2 {print $3}')
    percent=$((used * 100 / total))
    
    if [ $percent -lt 80 ]; then
        echo -e "${GREEN}✓ ${percent}% used${NC}"
        ((PASSED++))
    elif [ $percent -lt 90 ]; then
        echo -e "${YELLOW}⚠ ${percent}% used (Getting full)${NC}"
        ((WARNINGS++))
    else
        echo -e "${RED}✗ ${percent}% used (CRITICAL)${NC}"
        ((FAILED++))
    fi
}

# Function to check environment variables
check_env_vars() {
    echo -n "Checking environment variables... "
    
    required_vars=("MONGO_URI" "JWT_SECRET" "RAZORPAY_KEY_ID")
    missing=0
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            ((missing++))
        fi
    done
    
    if [ $missing -eq 0 ]; then
        echo -e "${GREEN}✓ All required variables set${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ $missing required variables missing${NC}"
        ((FAILED++))
    fi
}

# Run all checks
echo -e "${YELLOW}HTTP Endpoint Checks:${NC}"
check_http "Backend" "$BACKEND_URL/api/v1/health" "200"
check_http "Frontend" "$FRONTEND_URL" "200"

echo -e "\n${YELLOW}Performance Checks:${NC}"
check_response_time "Backend" "$BACKEND_URL/api/v1/health"
check_response_time "Frontend" "$FRONTEND_URL"

echo -e "\n${YELLOW}System Checks:${NC}"
check_disk_space
check_database
check_env_vars

# Summary
echo -e "\n======================================"
echo -e "${BLUE}Health Check Summary:${NC}"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✅ All systems healthy!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some checks failed. Please investigate.${NC}"
    exit 1
fi
