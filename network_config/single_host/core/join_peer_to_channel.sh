#!/bin/bash

####################################
### Imports                      ###
####################################

. scripts/utils.sh
. set_peer_var.sh

CHANNEL_NAME="$1"
PEER_NUMBER="$2"

DELAY="$3"
MAX_RETRY="$4"
VERBOSE="$5"
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

: ${CONTAINER_CLI:="docker"}
: ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI}-compose"}

FABRIC_CFG_PATH=$PWD/../config/


####################################
### Helpers Functions            ###
####################################

joinChannel() { 
 
    setPeerVars $PEER_NUMBER
	local rc=1
	local COUNTER=1
	## Sometimes Join takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
    peer channel join -b $BLOCKFILE >&log.txt
    res=$?
    { set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "After $MAX_RETRY attempts, $PEER_NUMBER has failed to join channel '$CHANNEL_NAME' "
}


infoln "Joining peer ${PEER_NUMBER} to ${CHANNEL_NAME}, using ${CONTAINER_CLI} and ${CONTAINER_CLI_COMPOSE}"
joinChannel


