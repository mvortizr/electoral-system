export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
. set_peer_var.sh
. scripts/utils.sh

CC_NAME="$1"
: ${CC_NAME:="basic"}

for PEER in {0..3}
do
## Install on P0
infoln "Installing chaincode on peer $PEER"
setPeerVars $PEER
peer lifecycle chaincode install ${CC_NAME}.tar.gz
done

