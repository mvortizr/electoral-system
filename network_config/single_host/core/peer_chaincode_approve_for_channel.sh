export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
. set_peer_var.sh
. set_orderer_vars.sh
. scripts/utils.sh


## Get the args from command line
# Parse Flags
while [[ $# -ge 1 ]] ; do
  key="$1"
  case $key in
  -p )
    APPROVAL_PEER="$2"
    shift
    ;;
  -ccname )
    CC_NAME="$2"
    shift
    ;;
  -ccver )
    CC_VERSION="$2"
    shift
    ;;
   -ccseq )
    CC_SEQUENCE="$2"
    shift
    ;;
   -ch )
    CHANNEL_NAME="$2"
    shift
    ;;
  * )
    errorln "Unknown flag: $key"
    exit 1
    ;;
  esac
  shift
done


CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid ${CC_NAME}.tar.gz)

setPeerVars $APPROVAL_PEER
setOrdererVars
   
# Note: Expected to change when we have multiple orderers and organizations
infoln "Peer #$APPROVAL_PEER is approving chaincode $CC_NAME with package ID $CC_PACKAGE_ID"
## Approve for current organization
peer lifecycle chaincode approveformyorg -o $ORDERER_IP --ordererTLSHostnameOverride $ORDERER_TLS_HOSTNAME --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tls --cafile $ORDERER_CA_FILE

## Check commit readiness
peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --sequence $CC_SEQUENCE --tls --cafile  $ORDERER_CA_FILE --output json