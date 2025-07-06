#!/bin/bash

# 1. Eliminar el clúster de Kind existente (para asegurar un inicio limpio)
echo "Eliminando clúster de Kind existente (si lo hay)..."
kind delete cluster --name couchdb-api-cluster

# 2. Crear un nuevo clúster de Kind con mapeo de puertos y etiqueta de nodo
echo "Creando nuevo clúster de Kind con mapeo de puertos 80/443 y etiqueta 'ingress-ready'..."
cat <<EOF | kind create cluster --name couchdb-api-cluster --config -
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    listenAddress: "0.0.0.0"
  - containerPort: 443
    hostPort: 443
    listenAddress: "0.0.0.0"
EOF

# 3. Desplegar el Nginx Ingress Controller
echo "Desplegando Nginx Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml || { echo "Error: Falló el despliegue del Nginx Ingress Controller."; exit 1; }

# 6. Construir y cargar la imagen Docker de tu API
echo "Construyendo y cargando la imagen Docker de tu API..."
# Asegúrate de que esta es la ruta correcta a la raíz de tu proyecto NestJS
cd ~/Documents/TESIS/electoral-system/couchdb-api/
docker build -t nestjs-couchdb-api:latest . || { echo "Error: Falló la construcción de la imagen Docker."; exit 1; }
kind load docker-image nestjs-couchdb-api:latest --name couchdb-api-cluster || { echo "Error: Falló la carga de la imagen Docker en Kind."; exit 1; }

# 7. Desplegar toda tu aplicación (CouchDB, API de NestJS e Ingresses)
# kubectl apply es idempotente, creará lo nuevo y actualizará lo existente.
echo "Desplegando toda la aplicación en Kubernetes (CouchDB, API de NestJS e Ingresses)..."
# Asegúrate de que esta es la ruta correcta a tus manifiestos
cd ~/Documents/TESIS/electoral-system/couchdb-api/k8/
kubectl apply -f deploy.yaml || { echo "Error: Falló la aplicación de los manifiestos de la aplicación."; exit 1; }

# 10. Verificar el estado de todos los pods
echo "Verificando pods..."
kubectl get pods -A

echo "Verificando recursos Ingress..."
kubectl get ingress

echo "Accede a CouchDB en: http://localhost/couchdb/"
echo "Accede a tu API en: http://localhost/api/items (POST)"