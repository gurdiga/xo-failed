#!/bin/bash

cd /var/www/preprod.executori.org

echo 'Git pull...'
git pull origin master >> .git.log 2>&1

if [ $? -ne 0 ]; then
  cat .git.log
  exit
fi

echo ''

. ./build/setez-permisiuni.sh
. ./build/pregzipuiesc.sh
. ./build/configurez-nginx.sh

./build/teste/integrare/start.sh
