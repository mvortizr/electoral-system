CC_NAME="$1"
ELECTION_NAME="$2"
: ${CC_NAME:="basic"}
: ${ELECTION_NAME:="election"}


# channel 1 - electoral roll (patrón electoral)
CHANNEL_1_NAME="${ELECTION_NAME}-ch1-roll"
# channel 2 - notebook (cuaderno electoral)
CHANNEL_2_NAME="${ELECTION_NAME}-ch2-notebook"
# channel 3 - notebook (cuaderno electoral)
CHANNEL_3_NAME="${ELECTION_NAME}-ch3-ballot"

# "$CHANNEL_1_NAME" "$CHANNEL_2_NAME" "$CHANNEL_3_NAME" 

### BASIC chaincode (for testing)
# Approve  chaincode for channel 1 using peer 0
source peer_chaincode_approve_for_channel.sh -p 0 -ccname ${CC_NAME} -ccver 0.1 -ccseq 1 -ch "$CHANNEL_1_NAME"

# Approve chaincode for channel 2 using peer 1
source peer_chaincode_approve_for_channel.sh -p 1 -ccname ${CC_NAME} -ccver 0.1 -ccseq 1 -ch "$CHANNEL_2_NAME"

#Approve chaincode for channel 3 using peer 1
source peer_chaincode_approve_for_channel.sh -p 1 -ccname ${CC_NAME} -ccver 0.1 -ccseq 1 -ch "$CHANNEL_3_NAME"