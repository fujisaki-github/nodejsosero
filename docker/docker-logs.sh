#!/bin/bash
cd `dirname $0`
source ./.env

docker-compose logs -f

