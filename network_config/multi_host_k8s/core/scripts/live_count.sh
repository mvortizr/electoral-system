function live_count() {
  local ns=$ORG1_NS  

  apply_template kube/live-count.yaml $ns

  kubectl -n $ns rollout status  deploy/nestjs-api-deployment

}


function bring_down_live_count_stack() {
  local ns=$ORG1_NS
  push_fn "Bringing down Live Count stack"

  # Delete Ingresses
  kubectl -n "$ns" delete ingress couchdb-ingress --ignore-not-found
  kubectl -n "$ns" delete ingress nestjs-api-ingress --ignore-not-found

  # Delete Services
  kubectl -n "$ns" delete service my-couchdb --ignore-not-found
  kubectl -n "$ns" delete service nestjs-api-service --ignore-not-found

  # Delete Deployments
  kubectl -n "$ns" delete deployment couchdb-deployment --ignore-not-found
  kubectl -n "$ns" delete deployment nestjs-api-deployment --ignore-not-found

  # Delete PVC and Secret
  kubectl -n "$ns" delete pvc couchdb-data-pvc --ignore-not-found
  kubectl -n "$ns" delete secret couchdb-creds --ignore-not-found

  pop_fn
}