ELECTION_NAME="$1"
: ${ELECTION_NAME:="election"}

# channel 1 - electoral roll (patrón electoral)
CHANNEL_1_NAME="${ELECTION_NAME}-ch1-roll"
# channel 2 - notebook (cuaderno electoral)
CHANNEL_2_NAME="${ELECTION_NAME}-ch2-notebook"
# channel 3 - notebook (cuaderno electoral)
CHANNEL_3_NAME="${ELECTION_NAME}-ch3-ballot"

# "$CHANNEL_1_NAME" "$CHANNEL_2_NAME" "$CHANNEL_3_NAME" 

### BASIC chaincode (for testing)
# Commit  chaincode for channel 1 using peer 0
source peer_chaincode_check_commit_for_channel.sh -p 0 -ccname basic  -ch "$CHANNEL_1_NAME"

# Commit chaincode for channel 2 using peer 1
source peer_chaincode_check_commit_for_channel.sh -p 1 -ccname basic -ch "$CHANNEL_2_NAME"

# Commit chaincode for channel 3 using peer 1
source peer_chaincode_check_commit_for_channel.sh -p 1 -ccname basic -ch "$CHANNEL_3_NAME"