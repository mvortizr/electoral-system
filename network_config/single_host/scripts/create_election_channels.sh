
# imports
. scripts/utils.sh

createChannelGenesisBlock() {
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


# Create channel 1 - electoral roll (patrón electoral)
CHANNEL_NAME="ch1-roll"

# Create channel 2 - notebook (cuaderno electoral)
CHANNEL_NAME="ch2-notebook"

# Create channel 3 - ballot box (urna electoral)
CHANNEL_NAME="ch3-ballot"
