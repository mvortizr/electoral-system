ELECTION_NAME="$1"
: ${ELECTION_NAME:="election"}

# channel 1 - electoral roll (patrón electoral)
CHANNEL_1_NAME="${ELECTION_NAME}-ch1-roll"

CALL='{"function":"setElectionConfig","Args":["1","2","3","4"]}'


#channel 1
source peer_chaincode_invoke.sh -p 0 -ccname channel1cc -ccver 0.1 -ccseq 1 -ch "$CHANNEL_1_NAME" -i "$CALL"