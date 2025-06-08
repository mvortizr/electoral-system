
function superadmin_command_group() {
  # set -x

  COMMAND=$1
  shift

  if [ "${COMMAND}" == "create" ]; then
    log "Creating super admins"
    create_super_admin
    log "🏁 - Superadmins created"
  fi
}


function create_super_admin(){
    register_org_admins
    enroll_org_admins
}


## These scripts are similar to normal enroll
function register_org_admins() {
  push_fn "Registering org superadmins"
  register_org_admin org1 org1super1 org1superadmin1pw

  pop_fn
}

function enroll_org_admins() {
  push_fn "Enrolling org Admin users"

  enroll_org_admin superadmin org1 org1super1 org1superadmin1pw
 
  pop_fn
}

# Register the org admin user
function register_org_admin() {
  local type=admin
  local org=$1
  local id_name=$2
  local id_secret=$3
  local ca_name=${org}-ca

  echo "Registering org admin $username"

  fabric-ca-client  register \
    --id.name       ${id_name} \
    --id.secret     ${id_secret} \
    --id.type       ${type} \
    --url           https://${ca_name}.${DOMAIN}:${NGINX_HTTPS_PORT} \
    --tls.certfiles $TEMP_DIR/cas/${ca_name}/tlsca-cert.pem \
    --mspdir        $TEMP_DIR/enrollments/${org}/users/${RCAADMIN_USER}/msp \
    --id.attrs      "hf.Registrar.Roles=client,hf.Registrar.Attributes=*,hf.Revoker=true,hf.GenCRL=true,admin=true:ecert,abac.init=true:ecert,role=superadmin:ecert"
}



# Enroll the admin client to the local certificate storage folder.
function enroll_org_admin() {
  local type=$1
  local org=$2
  local username=$3
  local password=$4

  echo "Enrolling $type org admin $username"

  ENROLLMENTS_DIR=${TEMP_DIR}/enrollments
  ORG_ADMIN_DIR=${ENROLLMENTS_DIR}/${org}/users/${username}

  # skip the enrollment if the admin certificate is available.
  if [ -f "${ORG_ADMIN_DIR}/msp/keystore/key.pem" ]; then
    echo "Found an existing admin enrollment at ${ORG_ADMIN_DIR}"
    return
  fi

  # Determine the CA information and TLS certificate
  CA_NAME=${org}-ca
  CA_DIR=${TEMP_DIR}/cas/${CA_NAME}

  CA_AUTH=${username}:${password}
  CA_HOST=${CA_NAME}.${DOMAIN}
  CA_PORT=${NGINX_HTTPS_PORT}
  CA_URL=https://${CA_AUTH}@${CA_HOST}:${CA_PORT}

  # enroll the org admin
  FABRIC_CA_CLIENT_HOME=${ORG_ADMIN_DIR} fabric-ca-client enroll \
    --url ${CA_URL} \
    --tls.certfiles ${CA_DIR}/tlsca-cert.pem

  # Construct an msp config.yaml
  CA_CERT_NAME=${CA_NAME}-$(echo $DOMAIN | tr -s . -)-${CA_PORT}.pem

  create_msp_config_yaml ${CA_NAME} ${CA_CERT_NAME} ${ORG_ADMIN_DIR}/msp

  # private keys are hashed by name, but we only support one enrollment.
  # test-network examples refer to this as "server.key", which is incorrect.
  # This is the private key used to endorse transactions using the admin's
  # public key.
  mv ${ORG_ADMIN_DIR}/msp/keystore/*_sk ${ORG_ADMIN_DIR}/msp/keystore/key.pem
}

# create an enrollment MSP config.yaml
function create_msp_config_yaml() {
  local ca_name=$1
  local ca_cert_name=$2
  local msp_dir=$3
  echo "Creating msp config ${msp_dir}/config.yaml with cert ${ca_cert_name}"

  cat << EOF > ${msp_dir}/config.yaml
NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/${ca_cert_name}
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/${ca_cert_name}
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/${ca_cert_name}
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/${ca_cert_name}
    OrganizationalUnitIdentifier: orderer
EOF
}