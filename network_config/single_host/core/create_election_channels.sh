################################
### Imports                 ####
################################

ROOTDIR=$(cd "$(dirname "$0")" && pwd)
export PATH=${ROOTDIR}/../bin:${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=true

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



##############################
## Creating the channels #####
##############################

CHANNEL_NAMES=( "$CHANNEL_1_NAME" "$CHANNEL_2_NAME" "$CHANNEL_3_NAME" )

for CHANNEL_NAME in "${CHANNEL_NAMES[@]}"
do
   source create_channel.sh "$CHANNEL_NAME"
done



#######################################
## Joining the corresponding peers#####
#######################################
source join_peers_to_channels.sh "$CHANNEL_1_NAME" "$CHANNEL_2_NAME" "$CHANNEL_3_NAME" 