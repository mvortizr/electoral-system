
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
. scripts/utils.sh
. set_peer_var.sh

# command for sample chaincode
# ./chaincode_package.sh -p ../../../chaincode/fabric_example_code/chaincode-javascript/ -lang node -label basic -v 0.1 

# Parse Flags
while [[ $# -ge 1 ]] ; do
  key="$1"
  case $key in
  -p )
    CC_SRC_PATH="$2"
    shift
    ;;
  -lang )
    CC_LANGUAGE="$2"
    shift
    ;;
  -label )
    CC_NAME="$2"
    shift
    ;;
   -v )
    CC_VERSION="$2"
    shift
    ;;
  * )
    errorln "Unknown flag: $key"
    exit 1
    ;;
  esac
  shift
done

#peer lifecycle chaincode package $OUT --path $CC_SRC_PATH --lang $CC_LANG --label ${CC_NAME}_${VERSION}

packageChaincode() {
  set -x
  peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid ${CC_NAME}.tar.gz)
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode packaging has failed"
  successln "Chaincode is packaged"
}


function checkPrereqs() {
  jq --version > /dev/null 2>&1

  if [[ $? -ne 0 ]]; then
    errorln "jq command not found..."
    errorln
    errorln "Follow the instructions in the Fabric docs to install the prereqs"
    errorln "https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html"
    exit 1
  fi
}

#check for prerequisites
checkPrereqs

#package chaincode
packageChaincode