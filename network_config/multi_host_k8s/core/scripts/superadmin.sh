function superadmin_command_group() {
  COMMAND=$1
  shift

  if [ "${COMMAND}" == "create" ]; then
    log "Creating super admins"
    superadmin_create
    log "🏁 - Superadmins created"
  fi
}

function superadmin_create(){
  while true; do
    log -n "Enter organization (e.g., org1): "
    read -p "Enter organization (e.g., org1): " ORG_NAME
    if [[ -z "$ORG_NAME" || ! "$ORG_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
      log "Invalid organization name. Only alphanumeric, dash, and underscore allowed."
    else
      break
    fi
  done

  while true; do
    log -n "Enter superadmin username: "
    read -p "Enter super admin username: " ADMIN_USER
    if [[ -z "$ADMIN_USER" || ! "$ADMIN_USER" =~ ^[a-zA-Z0-9_-]+$ ]]; then
      log "Invalid username. Only alphanumeric, dash, and underscore allowed."
    else
      break
    fi
  done

  while true; do
    log -n "Enter superadmin password: "
    read -s -p "Enter super admin password: " ADMIN_PW
    echo ""
    if [[ -z "$ADMIN_PW" || ${#ADMIN_PW} -lt 6 ]]; then
      log "Password must be at least 6 characters."
    else
      break
    fi
  done

  log -n "Processing superadmin creation"
  superadmin_register "$ORG_NAME" "$ADMIN_USER" "$ADMIN_PW"
  superadmin_enroll "$ORG_NAME" "$ADMIN_USER" "$ADMIN_PW"
}


function superadmin_register() {
  local org=$1
  local username=$2
  local password=$3

  push_fn "Registering superadmin: ${username}"
  superadmin_register_single "$org" "$username" "$password"
  pop_fn
}

function superadmin_enroll() {
  local org=$1
  local username=$2
  local password=$3

  push_fn "Enrolling superadmin: ${username}"
  superadmin_enroll_single superadmin "$org" "$username" "$password"
  pop_fn
}

function superadmin_register_single() {
  local type=admin
  local org=$1
  local id_name=$2
  local id_secret=$3
  local ca_name=${org}-ca

  echo "Registering org admin $id_name"

  fabric-ca-client register \
    --id.name       ${id_name} \
    --id.secret     ${id_secret} \
    --id.type       ${type} \
    --url           https://${ca_name}.${DOMAIN}:${NGINX_HTTPS_PORT} \
    --tls.certfiles $TEMP_DIR/cas/${ca_name}/tlsca-cert.pem \
    --mspdir        $TEMP_DIR/enrollments/${org}/users/${RCAADMIN_USER}/msp \
    --id.attrs      "hf.Registrar.Roles=client,hf.Registrar.Attributes=*,hf.Revoker=true,hf.GenCRL=true,admin=true:ecert,abac.init=true:ecert,role=superadmin:ecert"
}

function superadmin_enroll_single() {
  local type=$1
  local org=$2
  local username=$3
  local password=$4

  echo "Enrolling $type org admin $username"

  ENROLLMENTS_DIR=${TEMP_DIR}/enrollments
  ORG_ADMIN_DIR=${ENROLLMENTS_DIR}/${org}/users/${username}

  if [ -f "${ORG_ADMIN_DIR}/msp/keystore/key.pem" ]; then
    echo "Found an existing admin enrollment at ${ORG_ADMIN_DIR}"
    return
  fi

  CA_NAME=${org}-ca
  CA_DIR=${TEMP_DIR}/cas/${CA_NAME}
  CA_AUTH=${username}:${password}
  CA_HOST=${CA_NAME}.${DOMAIN}
  CA_PORT=${NGINX_HTTPS_PORT}
  CA_URL=https://${CA_AUTH}@${CA_HOST}:${CA_PORT}

  FABRIC_CA_CLIENT_HOME=${ORG_ADMIN_DIR} fabric-ca-client enroll \
    --url ${CA_URL} \
    --tls.certfiles ${CA_DIR}/tlsca-cert.pem

  CA_CERT_NAME=${CA_NAME}-$(echo $DOMAIN | tr -s . -)-${CA_PORT}.pem

  superadmin_create_msp_config_yaml ${CA_NAME} ${CA_CERT_NAME} ${ORG_ADMIN_DIR}/msp
  mv ${ORG_ADMIN_DIR}/msp/keystore/*_sk ${ORG_ADMIN_DIR}/msp/keystore/key.pem
}

function superadmin_create_msp_config_yaml() {
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
