export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer version
peer lifecycle chaincode package basic.tar.gz --path ../../../chaincode/fabric_example_code/chaincode-javascript/ --lang node --label basic_0.1


