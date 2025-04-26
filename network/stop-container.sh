#!/bin/bash

execute_command() {
    echo "Executing: $1"
    if ! eval "$1"; then
        echo "Error: Command failed - $1"
        exit 1
    fi
    sleep 2
}

echo "Stopping containers in reverse order..."

execute_command "docker stop couchdb1"
execute_command "docker stop couchdb0"
execute_command "docker stop peer0.org2.example.com"
execute_command "docker stop peer0.org1.example.com"
execute_command "docker stop orderer.example.com"

echo "Stopping Certificate Authorities (CAs)..."
execute_command "docker stop ca_orderer"
execute_command "docker stop ca.org2.example.com"
execute_command "docker stop ca.org1.example.com"

execute_command "docker stop $(docker ps -q)"

echo "✅ All containers stopped successfully."
