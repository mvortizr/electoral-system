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
    PEER="$2"
    shift
    ;;
  -ccname )
    CC_NAME="$2"
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


setPeerVars $PEER
setOrdererVars

infoln "Peer #$PEER is checking chaincode $CC_NAME in channel $CHANNEL_NAME"
peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name $CC_NAME --cafile $ORDERER_CA_FILE