#!/bin/bash

set -e

SERVER_NAME="executori.org"
ROOT=/var/www/$SERVER_NAME

sudo mkdir -p $ROOT

cd $ROOT
sudo chown `whoami`:`whoami` . 

if [ -d releases ]; then
  old_releases=`ls -1 releases | sed '$d' | sed '$d'`

  for release in $old_releases; do
    sudo rm -rf releases/$release
  done
else
  mkdir releases
fi

RELEASE=releases/`date +'%Y%m%d%H%M%S'`
git clone git@bitbucket.org:gurdiga/executori.git --depth 0 $RELEASE

ln -f -s -T $RELEASE stage

if [ ! -d data ]; then
  git clone git@bitbucket.org:gurdiga/data.executori.org.git --depth 1 data

  sudo chown -R www-data:`whoami` data 
  sudo su - www-data -c "php $ROOT/stage/bnm/download.php $ROOT/data/bnm"
fi

ln -f -s -T ../../data stage/date

if [ ! -L prod ]; then # initial reinstall
  sudo rm -f /etc/nginx/conf.d/executori.org
fi

STAGE_NGINX_CONF_D=/etc/nginx/conf.d/stage.executori.org
sudo ln -f -s -T $ROOT/stage/nginx.conf.d $STAGE_NGINX_CONF_D
cd stage
SERVER_NAME=stage.executori.org ROOT=$ROOT/stage make build
sudo unlink $STAGE_NGINX_CONF_D

SERVER_NAME=executori.org ROOT=$ROOT/prod NORESTART=1 build/configurez-nginx.sh
sudo ln -f -s -T $ROOT/prod/nginx.conf.d /etc/nginx/conf.d/executori.org

cd ..
unlink stage
ln -f -s -T $RELEASE prod
sudo /etc/init.d/nginx reload
