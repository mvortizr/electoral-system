# PASOS para red de prueba

```
./network.sh down
./network_prune.sh

```

```
nvm use default 16.4.0
./network.sh up 

```

```
./create_election_channels.sh

```

```
// si se quiere cambiar el chaincode se borrar el tar, de lo contrario conserva el empacado nuevo
./chaincode_package.sh
./chaincode_package.sh -p ../../../chaincode/chaincode-typescript/ -lang node -label basic -v 0.1 
./chaincode_package.sh -p ../../../chaincode/ch1 -lang node -label ch1_cc -v 0.1 

```
```
./peer_chaincode_install.sh
./peer_chaincode_install.sh ch1_cc //install in all
./peer_chaincode_install_p0.sh
./peer_chaincode_install_p0.sh ch1_cc

```
```
./chaincode_approve_all_channels.sh
./chaincode_approve_all_channels.sh ch1_cc

```

```
./chaincode_commit_all_channels.sh
./chaincode_commit_all_channels.sh  ch1_cc

```

```
peer_chaincode_invoke_basic_all-channels.sh
(to invoke basic chaincode)

```

# Para info
./channel_list.sh
./peer_query.sh
./chaincode_check_commit_all_channels.sh 
./chaincode_check_commit_all_channels.sh ch1_cc
./monitordocker.sh

# invokes

## Test
    
## ch1
./invokes/ch1/initLedger.sh
./invokes/ch1/createPosition.sh
./invokes/ch1/readElectionRoll.sh


## correr api
nvm use default 18.17.0
cd api/ch1
npm install
npm start




# Running the test network

You can use the `./network.sh` script to stand up a simple Fabric test network. The test network has two peer organizations with one peer each and a single node raft ordering service. You can also use the `./network.sh` script to create channels and deploy chaincode. For more information, see [Using the Fabric test network](https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html). The test network is being introduced in Fabric v2.0 as the long term replacement for the `first-network` sample.

Before you can deploy the test network, you need to follow the instructions to [Install the Samples, Binaries and Docker Images](https://hyperledger-fabric.readthedocs.io/en/latest/install.html) in the Hyperledger Fabric documentation.

## Using the Peer commands

The `setOrgEnv.sh` script can be used to set up the environment variables for the organizations, this will help to be able to use the `peer` commands directly.

First, ensure that the peer binaries are on your path, and the Fabric Config path is set assuming that you're in the `test-network` directory.

```bash
 export PATH=$PATH:$(realpath ../bin)
 export FABRIC_CFG_PATH=$(realpath ../config)
```

You can then set up the environment variables for each organization. The `./setOrgEnv.sh` command is designed to be run as follows.

```bash
export $(./setOrgEnv.sh Org2 | xargs)
```

(Note bash v4 is required for the scripts.)

You will now be able to run the `peer` commands in the context of Org2. If a different command prompt, you can run the same command with Org1 instead.
The `setOrgEnv` script outputs a series of `<name>=<value>` strings. These can then be fed into the export command for your current shell.

## Chaincode-as-a-service

To learn more about how to use the improvements to the Chaincode-as-a-service please see this [tutorial](./test-network/../CHAINCODE_AS_A_SERVICE_TUTORIAL.md). It is expected that this will move to augment the tutorial in the [Hyperledger Fabric ReadTheDocs](https://hyperledger-fabric.readthedocs.io/en/release-2.4/cc_service.html)


## Podman

*Note - podman support should be considered experimental but the following has been reported to work with podman 4.1.1 on Mac. If you wish to use podman a LinuxVM is recommended.*

Fabric's `install-fabric.sh` script has been enhanced to support using `podman` to pull down images and tag them rather than docker. The images are the same, just pulled differently. Simply specify the 'podman' argument when running the `install-fabric.sh` script. 

Similarly, the `network.sh` script has been enhanced so that it can use `podman` and `podman-compose` instead of docker. Just set the environment variable `CONTAINER_CLI` to `podman` before running the `network.sh` script:

```bash
CONTAINER_CLI=podman ./network.sh up
```

As there is no Docker-Daemon when using podman, only the `./network.sh deployCCAAS` command will work. Following the Chaincode-as-a-service Tutorial above should work. 

## Peer 0

```bash
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.voting_system.com/peers/peer0.org1.voting_system.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.voting_system.com/users/Admin@org1.voting_system.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```

### Peer 1
````bash
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.voting_system.com/peers/peer1.org1.voting_system.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.voting_system.com/users/Admin@org1.voting_system.com/msp
export CORE_PEER_ADDRESS=localhost:9051
```

