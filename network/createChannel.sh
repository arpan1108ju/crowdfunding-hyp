export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export PEER0_ORG1_CA=${PWD}/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export PEER0_ORG2_CA=${PWD}/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/config/

export CHANNEL_NAME="mychannel"

# setGlobalsForOrderer(){
#     export CORE_PEER_LOCALMSPID="OrdererMSP"
#     export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
#     export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/ordererOrganizations/example.com/users/Admin@example.com/msp
    
# }

setGlobalsForPeer0Org1(){
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}


setGlobalsForPeer0Org2(){
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
    
}


createChannel(){
  
    # echo "=============== setting globals for peer0Org1 ================="
    setGlobalsForPeer0Org1
    

    peer channel create -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.example.com \
    -f ./channel-artifacts/${CHANNEL_NAME}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME}.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}

# removeOldCrypto(){
#     rm -rf ./api-1.4/crypto/*
#     rm -rf ./api-1.4/fabric-client-kv-org1/*
#     rm -rf ./api-2.0/org1-wallet/*
#     rm -rf ./api-2.0/org2-wallet/*
# }


joinChannel(){
    setGlobalsForPeer0Org1
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer0Org2
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
}

updateAnchorPeers(){
    setGlobalsForPeer0Org1
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
    setGlobalsForPeer0Org2
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
}

removeChannel(){
    echo "### Leaving channel and cleaning artifacts for '$CHANNEL_NAME' ###"

    # Remove local block and anchor peer tx files
    rm -f ./channel-artifacts/${CHANNEL_NAME}.block
    # rm -f ./channel-artifacts/${CHANNEL_NAME}.tx
    echo "✅ Deleted channel-artifacts related to '${CHANNEL_NAME}'"

    # Optional: If using Docker Compose, can remove volumes or restart
    # docker-compose down -v
}


deleteChannel(){
    echo "### Deleting channel and cleaning up artifacts for '$CHANNEL_NAME' ###"

    # Set globals for Org1 and Org2 to leave the channel
    setGlobalsForPeer0Org1
    peer channel leave
    
    setGlobalsForPeer0Org2
    peer channel leave
    
    # Remove local block and anchor peer tx files
    rm -f ./channel-artifacts/${CHANNEL_NAME}.block
    rm -f ./channel-artifacts/${CHANNEL_NAME}.tx
    echo "✅ Deleted channel-artifacts related to '${CHANNEL_NAME}'"

    # Optional: If using Docker Compose, can remove volumes or restart
    # docker-compose down -v
}





checkChannel(){
    setGlobalsForPeer0Org1
    peer channel list
    
    setGlobalsForPeer0Org2
    # peer channel getinfo -c $CHANNEL_NAME
    peer channel list
}

# removeOldCrypto

createChannel
joinChannel
updateAnchorPeers
checkChannel

# deleteChannel