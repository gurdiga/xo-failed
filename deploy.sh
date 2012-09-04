#!/bin/bash

cd /var/www/executori.org
git pull

echo ''

./build/permissions.sh
./build/pregzip.sh
