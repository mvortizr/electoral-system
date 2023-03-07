#!/bin/bash

## imports  
. ./scripts/envVar.sh
. ./scripts/utils.sh

FABRIC_CFG_PATH=${PWD}/configtx
FABRIC_CFG_PATH=$PWD/../config/


## Parameters
ELECTION_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${ELECTION_NAME:="myElection"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

: ${CONTAINER_CLI:="docker"}
: ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI}-compose"}
infoln "Using ${CONTAINER_CLI} and ${CONTAINER_CLI_COMPOSE}"

if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

### Channel names
CHANNEL_1_NAME="${ELECTION_NAME}_channel1"
CHANNEL_2_NAME="${ELECTION_NAME}_channel2"
CHANNEL_3_NAME="${ELECTION_NAME}_channel3"

echo "channel1 name ${CHANNEL_1_NAME}"


### Helper Functions
createChannelGenesisBlock() {
	CHANNEL_NAME = $1

	infoln "Generating channel genesis block '${CHANNEL_NAME}.block'"

	which configtxgen
	if [ "$?" -ne 0 ]; then
		fatalln "configtxgen tool not found."
	fi
	set -x
	configtxgen -profile OneApplicationGenesis -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
	res=$?
	{ set +x; } 2>/dev/null
  verifyResult $res "Failed to generate channel ${CHANNEL_NAME} configuration transaction..."
}

createChannel() {
	CHANNEL_NAME = $1
	echo "channel name ${CHANNEL_NAME}"
	echo "channel name ${1}"
	#setGlobals 1
	# Poll in case the raft leader is not set yet
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
		osnadmin channel join --channelID $CHANNEL_NAME --config-block ./channel-artifacts/${CHANNEL_NAME}.block -o localhost:7053 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY" >&log.txt
		res=$?
		{ set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "Channel creation failed"	
}

###########################
## Channel 1
###########################
echo "Creating Channel 1"

createChannelGenesisBlock CHANNEL_1_NAME
BLOCKFILE="./channel-artifacts/${CHANNEL_1_NAME}.block"

#Peer 0 will create the channel

createChannel "${CHANNEL_1_NAME}"
successln "Channel '$CHANNEL_1_NAME' created"


echo "Creating Channel 2"
## Channel 2


echo "Creating Channel 3"
## Channel 3
