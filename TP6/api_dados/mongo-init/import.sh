#!/bin/bash
set -e

DIR=/docker-entrypoint-initdb.d

mongoimport --host localhost --db cinema --collection filmes  --type json --file $DIR/filmes.json  --jsonArray
mongoimport --host localhost --db cinema --collection atores  --type json --file $DIR/atores.json  --jsonArray
mongoimport --host localhost --db cinema --collection generos --type json --file $DIR/generos.json --jsonArray