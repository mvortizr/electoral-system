# Como correr local

```shell
npm install
```

```shell
npm run format
```

```shell
npm run build
```

```shell
TEST_NETWORK_HOME=$HOME/Documents/Noticias/.dumps/envs/old-el-envs/network_config/single_host/core AS_LOCAL_HOST=false npm run generateEnv
``` 
```shell
export REDIS_PASSWORD=$(uuidgen)
npm run start:redis
```

```shell
npm run start:dev
```


# Dockerfile

si el proceso está corriendo
```shell
docker container stop {ID}
docker container rm {ID}
```

```shell
export REDIS_PASSWORD=$(uuidgen)
docker-compose up -d
```

# Requests
```shell
APIKEY=$(grep ORG1_APIKEY .env | cut -d '=' -f 2-)
```

```shell
curl  http://localhost:3000/ready
curl --header "X-Api-Key: ${APIKEY}" http://localhost:3000/api/readAll
```