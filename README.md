# DELIVERY-POC

Simple POC utilisé pour expérimenter rabbitMQ, postgreSQL, redis et comment relier ces services dans une app Nodejs.

Stack:

- express
- postgreSQL
- redis
- rabbitMQ
- docker

## Démarrer l'app

```
// Lance redis, rabbitmq, et postgres:
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=deliveries -d postgres
// crée la table delivery dans postgres
docker exec -it postgres createdb -U postgres delivery
docker run --name redis -p 6379:6379 -d redis
docker run --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
// Relie les 3 services dans le même réseau
docker network create delivery-network && docker network connect delivery-network rabbitmq && docker network connect delivery-network postgres && docker network connect delivery-network redis

// A la racine
npm i
npm run dev -> file watcher activé pour redémarrer le serveur en cas de changement
ou npm start
node scripts/rabbitmq_worker.js // worker qui consomme la queue de rabbitmq
```

Ensuite, pour utiliser l'API (Curl, Postman...):
`GET http://localhost:8000/api/deliveries`

`POST http://localhost:8000/api/deliveries` avec en body (ex):
`{
"description": "Leroy Merlin"
}`
