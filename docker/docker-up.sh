#!/bin/bash
cd `dirname $0`
source ./.env

docker-compose up -d --build
