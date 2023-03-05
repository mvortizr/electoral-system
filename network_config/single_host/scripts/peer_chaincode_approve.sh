export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
# this id must be changed always to the result of peer lifecycle chaincode queryinstalled
export CC_PACKAGE_ID=basic_0.1:43719fa60b50e68467a357ae9922fd5deb1e209cfc50695b57f4fd376159912c

# P0 approves the chaincode

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.voting_system.com/peers/peer0.org1.voting_system.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.voting_system.com/users/Admin@org1.voting_system.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.voting_system.com --channelID mychannel --name basic --version 0.1 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/voting_system.com/orderers/orderer.voting_system.com/msp/tlscacerts/tlsca.voting_system.com-cert.pem"

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name basic --version 0.1 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/voting_system.com/orderers/orderer.voting_system.com/msp/tlscacerts/tlsca.voting_system.com-cert.pem" --output json