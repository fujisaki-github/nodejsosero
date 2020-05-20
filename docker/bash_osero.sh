#!/bin/bash
cd `dirname $0`
source ./.env

docker-compose exec osero /bin/bash

