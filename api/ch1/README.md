# Asset Transfer REST API Sample

Sample REST server to demonstrate good Fabric Node SDK practices.

The REST API is only intended to work with the [basic asset transfer example](https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic).

To install the basic asset transfer chaincode on a local Fabric network, follow the [Using the Fabric test network](https://hyperledger-fabric.readthedocs.io/en/release-2.4/test_network.html) tutorial. You need to go at least as far as the step where the ledger gets initialized with assets.

## Overview

The primary aim of this sample is to show how to write a long running client application using the Fabric Node SDK.
In particular, client applications **should not** create new connections for every transaction.

The sample also demonstrates possible error handling approaches and handles multiple requests from multiple identities.

The following sections describe the structure of the sample, or [skip to the usage section](#usage) to try it out first.

### Fabric network connections

The sample creates two long lived connections to a Fabric network in order to submit and evaluate transactions using two different identities.

The connections are made when the application starts and are retained for the life of the REST server.

Related files:

- [src/fabric.ts](src/fabric.ts)  
  All the sample code which interacts with the Fabric network via the Fabric SDK.
  For example, the `createGateway` function which connects to the Fabric network.
- [src/index.ts](src/index.ts)  
  The primary entry point for the sample.
  Connects to the Fabric network and starts the REST server.

### Error handling

In this sample submit transactions are retried if they fail with any error, **except** for errors from the smart contract, or duplicate transaction errors.

Alternatively you might prefer to modify the sample to only retry transactions which fail with specific errors instead, for example:

- MVCC_READ_CONFLICT
- PHANTOM_READ_CONFLICT
- ENDORSEMENT_POLICY_FAILURE
- CHAINCODE_VERSION_CONFLICT
- EXPIRED_CHAINCODE

Related files:

- [src/errors.ts](src/errors.ts)  
  All the Fabric transaction error handling and retry logic.

### Asset REST API

While the basic asset transfer chaincode maps well to an `/api/assets` REST API, response times when submitting transactions to a Fabric network are problematic for REST APIs.

A common approach to handle long running operations in REST APIs is to immediately return `202 ACCEPTED`, with the operation being represented by another resource, namely a `job` in this sample.

Jobs are used for submitting transactions to create, update, delete, or transfer an asset.
The `202 ACCEPTED` response includes a `jobId` which can be used with the `/api/jobs` endpoint to get the results of the create, update, delete, or transfer request.

Jobs are not used to get assets, because evaluating transactions is typically much faster.

Related files:

- [src/assets.router.ts](src/assets.router.ts)  
  Defines the main `/api/assets` endpoint.
- [src/fabric.ts](src/fabric.ts)  
  All the sample code which interacts with the Fabric network via the Fabric SDK.
- [src/jobs.router.ts](src/jobs.router.ts)  
  Defines the `/api/jobs` endpoint for getting job status.
- [src/jobs.ts](src/jobs.ts)
  Job queue implementation details.
- [src/transactions.router.ts](src/transactions.router.ts)  
  Defines the `/api/transactions` endpoint for getting transaction status.

**Note:** If you are not specifically interested in REST APIs, you should only need to look at the files in the [Fabric network connections](#fabric-network-connections) and [Error handling](#error-handling) sections above.

### REST server

The remaining sample files are related to the REST server aspects of the sample, rather than Fabric itself:

- [src/auth.ts](src/auth.ts)  
  Basic API key authentication strategy used for the sample.
- [src/config.ts](src/config.ts)  
  Descriptions of all the available configuration environment variables.
- [src/jobs.ts](src/jobs.ts)  
  Job queue implementation details.
- [src/logger.ts](src/logger.ts)  
  Logging implementation details.
- [src/redis.ts](src/redis.ts)  
  Redis implementation details.
- [src/server.ts](src/server.ts)
  Express server implementation details.

**Note:** If you are not specifically interested in REST APIs, you should only need to look at the files in the [Fabric network connections](#fabric-network-connections) and [Error handling](#error-handling) sections above.

## Usage

To build and start the sample REST server, you'll need to [download and install an LTS version of node](https://nodejs.org/en/download/)

Clone the `fabric-samples` repository and change to the `fabric-samples/asset-transfer-basic/rest-api-typescript` directory before running the following commands

**Note:** these instructions should work with the main branch of `fabric-samples`

Install dependencies

```shell
npm install
```

Build the REST server

```shell
npm run build
```

Create a `.env` file to configure the server for the test network (make sure TEST_NETWORK_HOME is set to the fully qualified `test-network` directory)

```shell
TEST_NETWORK_HOME=$HOME/fabric-samples/test-network npm run generateEnv

TEST_NETWORK_HOME=$HOME/Documents/Code/Tesis/fabric-samples/test-network npm run generateEnv
TEST_NETWORK_HOME=$HOME/Documents/Code/Tesis/Code/network_config/single_host/core npm run generateEnv
```

**Note:** see [src/config.ts](src/config.ts) for details of configuring the sample

Start a Redis server (Redis is used to store the queue of submit transactions)

```shell
export REDIS_PASSWORD=$(uuidgen)
npm run start:redis
```

si el proceso está corriendo
```
docker container stop {ID}
docker container rm {ID}
```

Start the sample REST server

```shell
npm run start:dev
```


### Prettier command

npx prettier . --write


## RUN

```
APIKEY=$(grep ORG1_APIKEY .env | cut -d '=' -f 2-)
```

```shell
curl  http://localhost:3000/ready
curl --header "X-Api-Key: ${APIKEY}" http://localhost:3000/api/readAll
```

```
channel1cc
```
# Asset Transfer REST API Sample

Sample REST server to demonstrate good Fabric Node SDK practices.

The REST API is only intended to work with the [basic asset transfer example](https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic).

To install the basic asset transfer chaincode on a local Fabric network, follow the [Using the Fabric test network](https://hyperledger-fabric.readthedocs.io/en/release-2.4/test_network.html) tutorial. You need to go at least as far as the step where the ledger gets initialized with assets.

## Overview

The primary aim of this sample is to show how to write a long running client application using the Fabric Node SDK.
In particular, client applications **should not** create new connections for every transaction.

The sample also demonstrates possible error handling approaches and handles multiple requests from multiple identities.

The following sections describe the structure of the sample, or [skip to the usage section](#usage) to try it out first.

### Fabric network connections

The sample creates two long lived connections to a Fabric network in order to submit and evaluate transactions using two different identities.

The connections are made when the application starts and are retained for the life of the REST server.

Related files:

- [src/fabric.ts](src/fabric.ts)  
  All the sample code which interacts with the Fabric network via the Fabric SDK.
  For example, the `createGateway` function which connects to the Fabric network.
- [src/index.ts](src/index.ts)  
  The primary entry point for the sample.
  Connects to the Fabric network and starts the REST server.

### Error handling

In this sample submit transactions are retried if they fail with any error, **except** for errors from the smart contract, or duplicate transaction errors.

Alternatively you might prefer to modify the sample to only retry transactions which fail with specific errors instead, for example:

- MVCC_READ_CONFLICT
- PHANTOM_READ_CONFLICT
- ENDORSEMENT_POLICY_FAILURE
- CHAINCODE_VERSION_CONFLICT
- EXPIRED_CHAINCODE

Related files:

- [src/errors.ts](src/errors.ts)  
  All the Fabric transaction error handling and retry logic.

### Asset REST API

While the basic asset transfer chaincode maps well to an `/api/assets` REST API, response times when submitting transactions to a Fabric network are problematic for REST APIs.

A common approach to handle long running operations in REST APIs is to immediately return `202 ACCEPTED`, with the operation being represented by another resource, namely a `job` in this sample.

Jobs are used for submitting transactions to create, update, delete, or transfer an asset.
The `202 ACCEPTED` response includes a `jobId` which can be used with the `/api/jobs` endpoint to get the results of the create, update, delete, or transfer request.

Jobs are not used to get assets, because evaluating transactions is typically much faster.

Related files:

- [src/assets.router.ts](src/assets.router.ts)  
  Defines the main `/api/assets` endpoint.
- [src/fabric.ts](src/fabric.ts)  
  All the sample code which interacts with the Fabric network via the Fabric SDK.
- [src/jobs.router.ts](src/jobs.router.ts)  
  Defines the `/api/jobs` endpoint for getting job status.
- [src/jobs.ts](src/jobs.ts)
  Job queue implementation details.
- [src/transactions.router.ts](src/transactions.router.ts)  
  Defines the `/api/transactions` endpoint for getting transaction status.

**Note:** If you are not specifically interested in REST APIs, you should only need to look at the files in the [Fabric network connections](#fabric-network-connections) and [Error handling](#error-handling) sections above.

### REST server

The remaining sample files are related to the REST server aspects of the sample, rather than Fabric itself:

- [src/auth.ts](src/auth.ts)  
  Basic API key authentication strategy used for the sample.
- [src/config.ts](src/config.ts)  
  Descriptions of all the available configuration environment variables.
- [src/jobs.ts](src/jobs.ts)  
  Job queue implementation details.
- [src/logger.ts](src/logger.ts)  
  Logging implementation details.
- [src/redis.ts](src/redis.ts)  
  Redis implementation details.
- [src/server.ts](src/server.ts)
  Express server implementation details.

**Note:** If you are not specifically interested in REST APIs, you should only need to look at the files in the [Fabric network connections](#fabric-network-connections) and [Error handling](#error-handling) sections above.

## Usage

To build and start the sample REST server, you'll need to [download and install an LTS version of node](https://nodejs.org/en/download/)

Clone the `fabric-samples` repository and change to the `fabric-samples/asset-transfer-basic/rest-api-typescript` directory before running the following commands

**Note:** these instructions should work with the main branch of `fabric-samples`

Install dependencies

```shell
npm install
```
```shell
npm run format
```

Build the REST server

```shell
npm run build
```


Create a `.env` file to configure the server for the test network (make sure TEST_NETWORK_HOME is set to the fully qualified `test-network` directory)

```shell
TEST_NETWORK_HOME=$HOME/fabric-samples/test-network npm run generateEnv

TEST_NETWORK_HOME=$HOME/Documents/Code/Tesis/fabric-samples/test-network npm run generateEnv
TEST_NETWORK_HOME=$HOME/Documents/Code/Tesis/Code/network_config/single_host/core npm run generateEnv
```

**Note:** see [src/config.ts](src/config.ts) for details of configuring the sample

Start a Redis server (Redis is used to store the queue of submit transactions)

```shell
export REDIS_PASSWORD=$(uuidgen)
npm run start:redis
```

si el proceso está corriendo
```
docker stop {ID}
docker rm {ID}
```



Start the sample REST server

```shell
npm run start:dev
```

### Prettier command

npx prettier . --write


## RUN

```
APIKEY=$(grep ORG1_APIKEY .env | cut -d '=' -f 2-)
```

```shell
curl --header "X-Api-Key: ${APIKEY}" http://localhost:3000/ready
```


```shell
curl --header "X-Api-Key: ${APIKEY}" http://localhost:3000/api/positions/readAll
```

## RUNNING THE DOCKER
```shell
TEST_NETWORK_HOME=$HOME/fabric-samples/test-network AS_LOCAL_HOST=false npm run generateEnv
TEST_NETWORK_HOME=$HOME/Documents/Code/Tesis/Code/network_config/single_host/core AS_LOCAL_HOST=false npm run generateEnv
```

**Note:** see [src/config.ts](src/config.ts) for details of configuring the sample

Start the sample REST server and Redis server

```shell
export REDIS_PASSWORD=$(uuidgen)
docker-compose up -d
```


