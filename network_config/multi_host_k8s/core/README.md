# Kubernetes Test Network 

This project re-establishes the Hyperledger [test-network](../test-network) as a _cloud native_ application.

### Objectives:

- Provide a simple, _one click_ activity for running the Fabric test network.
- Provide a reference guide for deploying _production-style_ networks on Kubernetes.
- Provide a _cloud ready_ platform for developing chaincode, Gateway, and blockchain apps.
- Provide a Kube supplement to the Fabric [CA Operations and Deployment](https://hyperledger-fabric-ca.readthedocs.io/en/latest/deployguide/ca-deploy.html) guides.
- Support a transition to [Chaincode as a Service](https://hyperledger-fabric.readthedocs.io/en/latest/cc_service.html).
- Support a transition from the Internal, Docker daemon to [External Chaincode](https://hyperledger-fabric.readthedocs.io/en/latest/cc_launcher.html) builders.
- Run on any Kube.

_Fabric, Ahoy!_ 


## Prerequisites:

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [jq](https://stedolan.github.io/jq/)
- [envsubst](https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html) (`brew install gettext` on OSX)

- K8s - either:
  - [KIND](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) + [Docker](https://www.docker.com) (resources: 8 CPU / 8 GRAM) 
  - [Rancher Desktop](https://rancherdesktop.io) (resources: 8 CPU / 8GRAM, mobyd, and disable Traefik)

## Quickstart 

Make sure that nothing is running on port 80

if Apache is running:
```shell
sudo systemctl disable apache2 && sudo systemctl stop apache2
```

if port is occupied
```
docker container ls
docker rm -f <container-name>
```

Create a KIND cluster:  
```shell
./network kind
./network cluster init
```

Launch the network, create a channel, and deploy the [basic-asset-transfer](../asset-transfer-basic) smart contract: 

```shell
./network up


./network channel create ##crear canales


```./network chaincode deploy channel1cc ../../../chaincode/ch1 1```###
```./network chaincode deploy channel2cc ../../../chaincode/ch2 2```###

```./network chaincode deploy channel2cc-4 ../../../chaincode/ch2 2```###



Invoke and query chaincode:
```shell
./network chaincode query  channel1cc 1 '{"function":"readEntireElectoralChannel","Args":[]}'
```
```shell
./network chaincode query  channel2cc 2 '{"function":"readEntireElectoralChannel","Args":[]}'
```


Access the blockchain with a [REST API](https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic/rest-api-typescript): 
```shell
./network rest
./network rest2
```



```shell
APIKEY=97834158-3224-4CE7-95F9-A148C886653E

```

```
curl  http://channel1-api.localho.st/checkHealth
```
```
curl --header "auth: 10060b68-340b-4b8d-8844-c94a1afe3a04" http://channel1-api.localho.st/config/checkAuthorization
```


Shut down the test network: 

```shell
./network unrest
./network unrest2
```

```shell
./network down 
```

Tear down the cluster (KIND): 
```shell
./network unkind
```

<!-- For Rancher: Preferences -> Kubernetes Settings -> Reset Kubernetes  OR ...
```shell
./network cluster clean -->
```


## [Detailed Guides](docs/README.md)

- [Working with Kubernetes](docs/KUBERNETES.md)
- [Certificate Authorities](docs/CA.md)
- [Launching the Test Network](docs/TEST_NETWORK.md)
- [Working with Channels](docs/CHANNELS.md)
- [Working with Chaincode](docs/CHAINCODE.md)
- [Working with Applications](docs/APPLICATIONS.md)


### DNS Resolution on OSX

Fabric's OSX binaries have been statically linked with the golang `go` DNS resolver.  In some environments, this 
causes a brief but [noticeable delay](https://github.com/hyperledger/fabric/issues/3372) when issuing peer commands 
against the test network.

Workarounds to improve DNS resolution time on OSX: 

- Add manual DNS overrides for virtual hosts by adding to /etc/hosts:
```
127.0.0.1 org0-ca.localho.st
127.0.0.1 org1-ca.localho.st
127.0.0.1 org2-ca.localho.st
127.0.0.1 org0-orderer1.localho.st
127.0.0.1 org0-orderer2.localho.st
127.0.0.1 org0-orderer3.localho.st
127.0.0.1 org1-peer1.localho.st
127.0.0.1 org1-peer2.localho.st
127.0.0.1 org2-peer1.localho.st
127.0.0.1 org2-peer2.localho.st
```

- Reduce the system resolver timeout from the default 5s by adding to /etc/resolv.conf:
```shell
options: timeout 2
```

- Compile the [fabric binaries](https://github.com/hyperledger/fabric) on a Mac and copy `build/bin/*` outputs to 
  `test-network-k8s/bin`.  Mac native builds are linked against the `netdns=cgo` DNS resolver, and are not
  subject to the timeouts associated with the Golang DNS resolver.


////

kubectl get namespaces

kubectl config set-context --current --namespace=voting-system-bchain-network

kubectl get deployments
kubectl delete deployment ch1-api --cascade=true

