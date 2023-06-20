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
    COMMITING_PEER="$2"
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


setPeerVars $COMMITING_PEER
setOrdererVars

infoln "Peer #$COMMITING_PEER is commiting chaincode $CC_NAME of channel $CHANNEL_NAME"

peer lifecycle chaincode commit -o $ORDERER_IP --ordererTLSHostnameOverride $ORDERER_TLS_HOSTNAME --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --sequence $CC_SEQUENCE --tls --cafile $ORDERER_CA_FILE --peerAddresses $CORE_PEER_ADDRESS --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE