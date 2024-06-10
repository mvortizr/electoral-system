: ${ELECTION_NAME:="election"}

# channel 1 - electoral roll (patrón electoral)
CHANNEL_1_NAME="${ELECTION_NAME}-ch1-roll"

CALL='{"function":"readEntireElectoralChannel","Args":[]}'


#channel 1
source peer_chaincode_invoke.sh -p 0 -ccname channel1cc -ccver 0.1 -ccseq 1 -ch "$CHANNEL_1_NAME" -i "$CALL"