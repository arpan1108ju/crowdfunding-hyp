# run from /network

docker-compose -f ./docker-compose-ca.yaml up -d

# sleep 5
# ./createChannel.sh

# sleep 2

# ./deployChaincode.sh