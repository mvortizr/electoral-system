#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This magical awk script led to 30 hours of debugging a "TLS handshake error"
# moral: do not edit / alter the number of '\' in the following transform:
# function one_line_pem {
#     echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
# }

# function json_ccp {
#   local ORG=$1
#   local PP=$(one_line_pem $2)
#   local CP=$(one_line_pem $3)
#   local NS=$4
#   sed -e "s/\${ORG}/$ORG/" \
#       -e "s#\${PEERPEM}#$PP#" \
#       -e "s#\${CAPEM}#$CP#" \
#       -e "s#\${NS}#$NS#" \
#       scripts/ccp-template.json
# }

function   construct_rest_configmap_ch1() {
  local ns=$ORG1_NS
  push_fn "Constructing connection profiles"

  #   keyDirectoryPath: string =  path.resolve(this.cryptoPath, 'users', 'User1@org1.voting_system.com', 'msp', 'keystore')
  #   certDirectoryPath: string=  path.resolve(this.cryptoPath, 'users', 'User1@org1.voting_system.com', 'msp', 'signcerts')
  #   tlsCertPath:string = path.resolve(this.cryptoPath, 'peers', 'peer0.org1.voting_system.com', 'tls', 'ca.crt')

  ENROLLMENT_DIR=${TEMP_DIR}/enrollments
  CHANNEL_MSP_DIR=${TEMP_DIR}/channel-msp
  CONFIG_DIR=${TEMP_DIR}/channel1-config

  mkdir -p $CONFIG_DIR

  

  # static envs
  printf "10060b68-340b-4b8d-8844-c94a1afe3a04"> $CONFIG_DIR/API_KEY
  printf "Org1MSP" > $CONFIG_DIR/MSP_ID 
  printf "org1-peer0.${ORG1_NS}.svc.cluster.local:7051" > $CONFIG_DIR/PEER_ENDPOINT
  printf "election-ch1-roll" > $CONFIG_DIR/CHANNEL_NAME
  printf "org1-peer0"> $CONFIG_DIR/PEER_HOST_ALIAS


  cp $ENROLLMENT_DIR/org1/users/org1admin/msp/signcerts/cert.pem $CONFIG_DIR/CERT_DIRECTORY
  cp $ENROLLMENT_DIR/org1/users/org1admin/msp/keystore/key.pem $CONFIG_DIR/KEY_DIRECTORY 
  cp $CHANNEL_MSP_DIR/peerOrganizations/org1/msp/tlscacerts/tlsca-signcert.pem $CONFIG_DIR/PEER_TLS_CERT


  kubectl -n $ns delete configmap channel1-configmap || true
  kubectl -n $ns create configmap channel1-configmap --from-file=$CONFIG_DIR

  pop_fn
}

function rollout_rest_api_ch1() {
  local ns=$ORG1_NS
  push_fn "Starting rest_api_ch1"

  kubectl -n $ns apply -f kube/ch1-api.yaml
  kubectl -n $ns rollout status deploy/ch1-api

  pop_fn
}

function bring_down_rest_api_ch1() {
  local ns=$ORG1_NS
  push_fn "Bringing down API ch1"
  kubectl -n $ns delete configmap channel1-configmap
  kubectl -n $ns delete deployment channel1-api
  kubectl -n $ns  delete service channel1-api
  kubectl -n $ns delete ingress channel1-api
  pop_fn

}


function launch_rest_api_ch1() {
  local ns=$ORG1_NS
  construct_rest_configmap_ch1

  apply_template kube/channel1-api.yaml $ns

  kubectl -n $ns rollout status deploy/channel1-api


}