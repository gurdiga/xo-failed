#!/bin/bash

if [ "$1" == 'prod' ]; then
  cd /var/www/executori.org
else
  cd /var/www/preprod.executori.org
fi

. ./build/git-pull.sh
. ./build/setez-permisiuni.sh
. ./build/pregzipuiesc.sh
. ./build/configurez-nginx.sh

if [ ! "$1" == 'prod' ]; then
  ./build/teste/integrare/start.sh
fi
