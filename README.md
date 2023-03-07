# Blockchain del Sistema de Elecciones UCAB (voting-system-bchain)


## Instrucciones para correr la network single host

1. Ir a carpeta network_config > single_host > scripts
2. En ese terminal se debe ejecutar el comando ```./network.sh up``` con permisos de administrador. 
Este script va a levantar los 5 dockers (uno cli y 4 peers) que componen la red además de crear los elementos criptográficos para registrar cada uno de ellos

Para revisar los dockers generados, los volúmenes y las redes puede utilizar los siguientes comandos:
```docker ps ``` - ver containers activos
```docker volume ls``` - ver volumenes activos
``` docker network ls ``` - ver redes activas

3. Para tumbar la red ejecute el comando ```./network.sh down``` en este mismo directorio




## Pipeline para ejecución de prueba
Todos se corren tomando como PWD network_config > single_host > scripts

1. ```./network.sh down``` - elimina los dockers de la red activos
2. ```./network.sh createChannel``` - crea un canal myChannel utilizando el peer 0
3. ```./join_peer_1.sh``` - une el peer1 al cannal myChannel
4. ```./chaincode_package.sh``` - empaca el chaincode (lo vuelve tar)
5. ```./peer_chaincode_install_p0.sh``` y ```./peer_chaincode_install_p1.sh``` instala chaincode en peer 0 y peer1
6. ```./peer_chaincode_approve.sh``` aprueba el chaincode (de parte de peer 0)
7. ```./peer_chaincode_commit.sh``` hace commit del chaincode (de parte de peer 0)
9. ```./peer_chaincode_check.sh`` te dice el estado actual de chaincode (aprobado o no)
10. ```./peer_chaincode_invoke1.sh`` y ```./peer_chaincode_invoke2.sh``` invoca diferentes funciones del chaincode, invoke1 inserta assets en el ledger y invoke 2 los consulta



### Scripts de información 
Todos se corren tomando como PWD network_config > single_host > scripts

```peer_channel_list.sh``` te menciona cada peer con los canales a los que está unido
```peer_query ``` - te dice el estado de "readiness" del chaincode  