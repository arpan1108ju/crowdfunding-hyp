#!/bin/bash

# Function to execute a command with error checking
execute_command() {
    echo "Executing: $1"
    if ! eval "$1"; then
        echo "Error: Command failed - $1"
        exit 1
    fi
    sleep 2
}


# Main execution flow
execute_command "./scripts/start-docker-ca.sh"
execute_command "./scripts/create-certificate-with-ca.sh"
execute_command "./scripts/generateOnlyChannelAndBlocks.sh"
execute_command "./scripts/start-without-ca.sh"
execute_command "./createChannel.sh"
execute_command "./deployChaincodeCrowdFundingGo.sh"

echo "All commands executed successfully!"