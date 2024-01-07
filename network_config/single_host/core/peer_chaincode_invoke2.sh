export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.voting_system.com/peers/peer0.org1.voting_system.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.voting_system.com/users/Admin@org1.voting_system.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer chaincode query -C election-ch1-roll -n basic -c '{"Args":["GetAllAssets"]}'
