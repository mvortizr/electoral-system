#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#



function   construct_rest_configmap_ch2() {
  local ns=$ORG1_NS
  push_fn "Constructing connection profiles"

  #   keyDirectoryPath: string =  path.resolve(this.cryptoPath, 'users', 'User1@org1.voting_system.com', 'msp', 'keystore')
  #   certDirectoryPath: string=  path.resolve(this.cryptoPath, 'users', 'User1@org1.voting_system.com', 'msp', 'signcerts')
  #   tlsCertPath:string = path.resolve(this.cryptoPath, 'peers', 'peer0.org1.voting_system.com', 'tls', 'ca.crt')

  ENROLLMENT_DIR=${TEMP_DIR}/enrollments
  CHANNEL_MSP_DIR=${TEMP_DIR}/channel-msp
  CONFIG_DIR=${TEMP_DIR}/channel2-config
  CHAINCODE_NAME="$1"

  mkdir -p $CONFIG_DIR

  

  # static envs
  printf "10060b68-340b-4b8d-8844-c94a1afe3a04"> $CONFIG_DIR/API_KEY
  printf "Org1MSP" > $CONFIG_DIR/MSP_ID 
  printf "org1-peer1.${ORG1_NS}.svc.cluster.local:7051" > $CONFIG_DIR/PEER_ENDPOINT
  printf "election-ch2-notebook" > $CONFIG_DIR/CHANNEL_NAME
  printf "org1-peer1"> $CONFIG_DIR/PEER_HOST_ALIAS
  printf "channel2cc-5"> $CONFIG_DIR/CHAINCODE_NAME


  cp $ENROLLMENT_DIR/org1/users/org1admin/msp/signcerts/cert.pem $CONFIG_DIR/CERT_DIRECTORY
  cp $ENROLLMENT_DIR/org1/users/org1admin/msp/keystore/key.pem $CONFIG_DIR/KEY_DIRECTORY 
  cp $CHANNEL_MSP_DIR/peerOrganizations/org1/msp/tlscacerts/tlsca-signcert.pem $CONFIG_DIR/PEER_TLS_CERT


  kubectl -n $ns delete configmap channel2-configmap || true
  kubectl -n $ns create configmap channel2-configmap --from-file=$CONFIG_DIR

  pop_fn
}

function rollout_rest_api_ch2() {
  local ns=$ORG1_NS
  push_fn "Starting rest_api_ch2"

  kubectl -n $ns apply -f kube/ch2-api.yaml
  kubectl -n $ns rollout status deploy/ch2-api

  pop_fn
}

function bring_down_rest_api_ch2() {
  local ns=$ORG1_NS
  push_fn "Bringing down API ch2"
  kubectl -n $ns delete configmap channel2-configmap
  kubectl -n $ns delete deployment channel2-api
  kubectl -n $ns  delete service channel2-api
  kubectl -n $ns delete ingress channel2-api
  pop_fn

}


function launch_rest_api_ch2() {
  local ns=$ORG1_NS  
  # push_fn "this is number one $1"
  # pop_fn
  construct_rest_configmap_ch2 $1

  apply_template kube/channel2-api.yaml $ns

  kubectl -n $ns rollout status deploy/channel2-api


}