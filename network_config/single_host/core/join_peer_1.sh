
# Join peer 1 to channel
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer version

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.voting_system.com/peers/peer1.org1.voting_system.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.voting_system.com/users/Admin@org1.voting_system.com/msp
export CORE_PEER_ADDRESS=localhost:9051
BLOCKFILE="./channel-artifacts/mychannel.block"

peer channel join -b $BLOCKFILE 