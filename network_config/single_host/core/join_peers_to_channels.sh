################################
### Definitions             ####
################################

# channel 1 - electoral roll (patrón electoral)
CHANNEL_1_NAME=$1
# channel 2 - notebook (cuaderno electoral)
CHANNEL_2_NAME=$2
# channel 3 - notebook (cuaderno electoral)
CHANNEL_3_NAME=$3


# Join p0 and p1 to channel 1
source join_peer_to_channel.sh "$CHANNEL_1_NAME" 0
source join_peer_to_channel.sh "$CHANNEL_1_NAME" 1

# Join p1 and p2 to channel 2
source join_peer_to_channel.sh "$CHANNEL_2_NAME" 1
source join_peer_to_channel.sh "$CHANNEL_2_NAME" 2

# Join p1, p2 and p3 to channel 3
source join_peer_to_channel.sh "$CHANNEL_3_NAME" 1
source join_peer_to_channel.sh "$CHANNEL_3_NAME" 2
source join_peer_to_channel.sh "$CHANNEL_3_NAME" 3


