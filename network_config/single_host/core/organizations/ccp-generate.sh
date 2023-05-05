#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $7)
    local CP=$(one_line_pem $8)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${P2PORT}/$4/" \
        -e "s/\${P3PORT}/$5/" \
        -e "s/\${CAPORT}/$6/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $7)
    local CP=$(one_line_pem $8)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${P1PORT}/$4/" \
        -e "s/\${P1PORT}/$5/" \
        -e "s/\${CAPORT}/$6/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=1
P0PORT=7051
P1PORT=9051
P2PORT=20051
P3PORT=10051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/org1.voting_system.com/tlsca/tlsca.org1.voting_system.com-cert.pem
CAPEM=organizations/peerOrganizations/org1.voting_system.com/ca/ca.org1.voting_system.com-cert.pem


echo "$(json_ccp $ORG $P0PORT $P1PORT $P2PORT $P3PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.voting_system.com/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $P1PORT $P2PORT $P3PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.voting_system.com/connection-org1.yaml
