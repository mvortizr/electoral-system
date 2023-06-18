export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
. set_peer_var.sh
. scripts/utils.sh

CC_NAME="$1"
: ${CC_NAME:="basic"}

for PEER in {0..3}
do
## Install on peers
infoln "Installing chaincode on peer $PEER"
setPeerVars $PEER
peer lifecycle chaincode install ${CC_NAME}.tar.gz
done


## This has to be different for each peer because we are not going to have the same chaincode for everything