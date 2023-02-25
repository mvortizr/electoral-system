# Network down isn't deleting all the required info, this script deletes volumes and networks associated with the network
docker volume rm compose_orderer.example.com compose_peer0.org1.example.com compose_peer0.org2.example.com compose_peer1.org1.example.codocker network rm fabric_test
docker network rm fabric_test