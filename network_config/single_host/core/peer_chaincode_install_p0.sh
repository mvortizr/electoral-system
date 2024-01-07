export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
. set_peer_var.sh
. scripts/utils.sh

CC_NAME="$1"
: ${CC_NAME:="basic"}

setPeerVars 0
peer lifecycle chaincode install ${CC_NAME}.tar.gz