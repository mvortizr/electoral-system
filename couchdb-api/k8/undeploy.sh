#!/bin/bash
kind delete cluster --name couchdb-api-cluster
echo "Eliminando despliegue de la aplicación en Kubernetes..."
# Elimina todos los recursos definidos en los archivos YAML del directorio actual
kubectl delete -f .
echo "Eliminación completada."
echo "Verificando que no haya pods restantes..."
kubectl get pods