ELECTION_NAME="$1"
: ${ELECTION_NAME:="election"}

# channel 1 - electoral roll (patrón electoral)
CHANNEL_1_NAME="${ELECTION_NAME}-ch1-roll"
# channel 2 - notebook (cuaderno electoral)
CHANNEL_2_NAME="${ELECTION_NAME}-ch2-notebook"
# channel 3 - notebook (cuaderno electoral)
CHANNEL_3_NAME="${ELECTION_NAME}-ch3-ballot"

FUNCTION_INIT='{"function":"InitLedger","Args":[]}'
FUNCTION_QUERY='{"Args":["GetAllAssets"]}'


#channel 1
source peer_chaincode_invoke.sh -p 1 -ccname basic -ccver 0.1 -ccseq 1 -ch "$CHANNEL_1_NAME" -i "$FUNCTION_INIT"
source peer_chaincode_invoke.sh -p 1 -ccname basic -ccver 0.1 -ccseq 1 -ch "$CHANNEL_1_NAME" -i "$FUNCTION_QUERY"


#channel 2
source peer_chaincode_invoke.sh -p 1 -ccname basic -ccver 0.1 -ccseq 1 -ch "$CHANNEL_2_NAME" -i "$FUNCTION_INIT"
source peer_chaincode_invoke.sh -p 1 -ccname basic -ccver 0.1 -ccseq 1 -ch "$CHANNEL_2_NAME" -i "$FUNCTION_QUERY"


#channel 3
source peer_chaincode_invoke.sh -p 1 -ccname basic -ccver 0.1 -ccseq 1 -ch "$CHANNEL_3_NAME" -i "$FUNCTION_INIT"
source peer_chaincode_invoke.sh -p 1 -ccname basic -ccver 0.1 -ccseq 1 -ch "$CHANNEL_3_NAME" -i "$FUNCTION_QUERY"