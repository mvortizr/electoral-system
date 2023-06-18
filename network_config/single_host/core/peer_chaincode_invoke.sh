export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
. set_peer_var.sh
. set_orderer_vars.sh
. scripts/utils.sh


while [[ $# -ge 1 ]] ; do
  key="$1"
  case $key in
  -p )
    INVOKING_PEER="$2"
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
   -i )
    CC_INVOKE="$2"
    shift
    ;;
  * )
    errorln "Unknown flag: $key"
    exit 1
    ;;
  esac
  shift
done


setPeerVars $INVOKING_PEER
setOrdererVars


infoln "Invoke $CC_INVOKE using $INVOKING_PEER in channel $CHANNEL_NAME"
peer chaincode invoke -o  $ORDERER_IP  --ordererTLSHostnameOverride $ORDERER_TLS_HOSTNAME --tls --cafile $ORDERER_CA_FILE -C $CHANNEL_NAME  -n $CC_NAME --peerAddresses $CORE_PEER_ADDRESS --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE -c $CC_INVOKE

