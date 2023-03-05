# Network down isn't deleting all the required info, this script deletes volumes and networks associated with the network
docker volume rm compose_orderer.voting_system.com 
docker volume rm compose_peer0.org1.voting_system.com 
docker volume rm compose_peer0.org2.voting_system.com 
docker volume rm compose_peer1.org1.voting_system.com
docker network rm fabric_test

removeContainers() {
    docker stop $(docker ps -aq)
    docker rm $(docker ps -aq)
}

removeEverythingDocker() {
    removecontainers
    docker network prune -f
    docker rmi -f $(docker images --filter dangling=true -qa)
    docker volume rm $(docker volume ls --filter dangling=true -q)
    docker rmi -f $(docker images -qa)
}