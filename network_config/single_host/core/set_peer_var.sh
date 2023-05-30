
. scripts/utils.sh

export PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/voting_system.com/tlsca/tlsca.voting_system.com-cert.pem
export ORG1_CA=${PWD}/organizations/peerOrganizations/org1.voting_system.com/tlsca/tlsca.org1.voting_system.com-cert.pem


P0PORT=7051
P1PORT=9051
P2PORT=20051
P3PORT=10051

setPeerVars() {
  local PEER=""
  if [ -z "$OVERRIDE_PEER" ]; then
    PEER=$1
  else
    PEER="${OVERRIDE_PEER}"
  fi
  infoln "Setting variables for peer ${PEER}"
  export PEER_LOCALMSPID="Org1MSP"
  export PEER_TLS_ROOTCERT_FILE=$ORG1_CA
  export PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.voting_system.com/users/Admin@org1.voting_system.com/msp
 
 if [ $PEER -eq 0 ]; then   
    export PEER_ADDRESS=localhost:7051
  elif [ $PEER -eq 1 ]; then
    export PEER_ADDRESS=localhost:9051
  elif [ $PEER -eq 2 ]; then
    export PEER_ADDRESS=localhost:20051
  elif [ $PEER -eq 3 ]; then
    export PEER_ADDRESS=localhost:10051
    errorln "PEER Unknown"
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}