#!/bin/bash

cd /var/www/executori.org

echo 'Git pull...'
git pull origin master >> .git.log 2>&1
echo ''

./build/permissions.sh
./build/pregzip.sh
