#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f dev.env ]; then
    export $(cat dev.env | grep -v '^#' | xargs)
fi

# Build the Docker image with build args
docker build \
  --build-arg VITE_KEYCLOAK_URL="${VITE_KEYCLOAK_URL}" \
  --build-arg VITE_KEYCLOAK_REALM="${VITE_KEYCLOAK_REALM}" \
  --build-arg VITE_KEYCLOAK_CLIENT_ID="${VITE_KEYCLOAK_CLIENT_ID}" \
  --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
  --build-arg VITE_AUTH_MODE="${VITE_AUTH_MODE}" \
  --target production \
  -t dockerreg.solvo.ru/solvo/reg/carrier-portal:latest \
  .

echo "Build completed. You can now run:"
echo "docker run -d -p 3000:80 --name carrier-portal carrier-portal-frontend:latest"