# Input paths
CRYPTO_PATH="../../network_config/single_host/core/organizations/peerOrganizations/org1.voting_system.com"
KEY_DIRECTORY_PATH=$(realpath "${CRYPTO_PATH}/users/User1@org1.voting_system.com/msp/keystore/priv_sk")
CERT_DIRECTORY_PATH=$(realpath "${CRYPTO_PATH}/users/User1@org1.voting_system.com/msp/signcerts/User1@org1.voting_system.com-cert.pem")
TLS_CERT_PATH=$(realpath "${CRYPTO_PATH}/peers/peer0.org1.voting_system.com/tls/ca.crt")

rm -rf .env
touch .env
echo 'API_KEY = "10060b68-340b-4b8d-8844-c94a1afe3a04"' >> .env
echo 'MSP_ID = "Org1MSP"' >> .env
echo 'PEER_ENDPOINT = "localhost:7051"'  >> .env
echo 'PEER_HOST_ALIAS = "peer0.org1.voting_system.com"' >> .env
echo 'CHANNEL_NAME = "election-ch1-roll"' >> .env
echo "PEER_TLS_CERT='$(cat ${TLS_CERT_PATH})'" >> .env
echo "KEY_DIRECTORY='$(cat ${KEY_DIRECTORY_PATH})'" >> .env
echo "CERT_DIRECTORY='$(cat ${CERT_DIRECTORY_PATH})'" >> .env
