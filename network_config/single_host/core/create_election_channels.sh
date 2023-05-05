################################
### Imports                 ####
################################

ROOTDIR=$(cd "$(dirname "$0")" && pwd)
export PATH=${ROOTDIR}/../bin:${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=true

. ./scripts/envVar.sh
. ./scripts/utils.sh




################################
### Parsing parameters      ####
################################
ELECTION_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${ELECTION_NAME:="election"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}



: ${CONTAINER_CLI:="docker"}
: ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI}-compose"}
infoln "Using ${CONTAINER_CLI} and ${CONTAINER_CLI_COMPOSE}"



#############################################
### Create the directory for all blocks  ####
#############################################
if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

################################
### Generate channel names  ####
################################
# channel 1 - electoral roll (patrón electoral)
CHANNEL_1_NAME="${ELECTION_NAME}-ch1-roll"
# channel 2 - notebook (cuaderno electoral)
CHANNEL_2_NAME="${ELECTION_NAME}-ch2-notebook"
# channel 3 - notebook (cuaderno electoral)
CHANNEL_3_NAME="${ELECTION_NAME}-ch3-ballot"



################################
### Helper functions        ####
################################

createChannelGenesisBlock() {
	CHANNEL_NAME="$1"

	infoln "Generating channel genesis block ${CHANNEL_NAME}.block"

	which configtxgen
	if [ "$?" -ne 0 ]; then
		fatalln "configtxgen tool not found."
	fi
	set -x
	configtxgen -profile OneApplicationGenesis -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
	res=$?
	{ set +x; } 2>/dev/null
  verifyResult $res "Failed to generate channel configuration transaction..."
}

createChannel() {
	CHANNEL_NAME="$1"
	infoln "Creating channel ${CHANNEL_NAME}"

	setGlobals 1
	#TODO Poll in case the raft leader is not set yet
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



##############################
## Creating the channels #####
##############################

infoln "Channel creation process started for Channel 1"
createChannelGenesisBlock "$CHANNEL_1_NAME"
BLOCKFILE="./channel-artifacts/${CHANNEL_1_NAME}.block"
createChannel "$CHANNEL_1_NAME"
successln "Channel '$CHANNEL_1_NAME' created"


infoln "Channel creation process started for Channel 2"
## Channel 2


infoln "Channel creation process started for Channel 3"
## Channel 3


################################
### Joining Peers to Channels###
################################
