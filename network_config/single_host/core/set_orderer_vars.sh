
setOrdererVars () {
    export ORDERER_IP="localhost:7050"
    export ORDERER_TLS_HOSTNAME="orderer.voting_system.com"
    export ORDERER_CA_FILE="${PWD}/organizations/ordererOrganizations/voting_system.com/orderers/orderer.voting_system.com/msp/tlscacerts/tlsca.voting_system.com-cert.pem"
}

