#!/bin/bash

if [ "$1" == 'prod' ]; then
  echo cd /var/www/executori.org
else
  echo cd /var/www/preprod.executori.org
fi

. build/git-pull.sh
. build/setez-permisiuni.sh
. build/pregzipuiesc.sh
. build/configurez-nginx.sh

./build/teste/integrare/start.sh && . $0 prod
