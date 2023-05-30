
: ${ELECTION_NAME:="election"}
# channel 1 - electoral roll (patrón electoral)
CHANNEL_1_NAME="${ELECTION_NAME}-ch1-roll"
# channel 2 - notebook (cuaderno electoral)
CHANNEL_2_NAME="${ELECTION_NAME}-ch2-notebook"
# channel 3 - notebook (cuaderno electoral)
CHANNEL_3_NAME="${ELECTION_NAME}-ch3-ballot"

source join_peers_to_channels.sh "$CHANNEL_1_NAME" "$CHANNEL_2_NAME" "$CHANNEL_3_NAME" 