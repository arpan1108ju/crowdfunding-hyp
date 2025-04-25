#!/bin/bash

execute_command() {
    echo "Executing: $1"
    if ! eval "$1"; then
        echo "Error: Command failed - $1"
        exit 1
    fi
    sleep 2
}

echo "Starting Certificate Authorities (CAs)..."
execute_command "docker start ca.org1.example.com"
execute_command "docker start ca.org2.example.com"
execute_command "docker start ca_orderer"

echo "Waiting for CAs to initialize..."
sleep 5

echo "Starting remaining containers..."
execute_command "docker start orderer.example.com"
execute_command "docker start peer0.org1.example.com"
execute_command "docker start peer0.org2.example.com"
execute_command "docker start couchdb0"
execute_command "docker start couchdb1"
execute_command "docker start couchdb1"
execute_command "docker start couchdb1"

docker start $(docker ps -a -q -f "status=exited")

echo "✅ All containers started successfully."
