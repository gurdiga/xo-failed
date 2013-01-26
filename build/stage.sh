#!/bin/bash

set -e

ROOT=/var/www/stage.executori.org
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

if [ -L stage ]; then
  unlink stage
fi

ln -s $RELEASE stage

if [ ! -d data ]; then
  git clone git@bitbucket.org:gurdiga/data.executori.org.git --depth 1 data

  sudo chown -R www-data:`whoami` data 
  ls -la data
  sudo su - www-data -c "php $ROOT/stage/bnm/download.php $ROOT/data/bnm"

  ln -s ../../data stage/date
fi

export SERVER_NAME="stage.executori.org"
export ENV=stage
cd stage
make build

exit

ln -s $RELEASE prod
rm -rf prod/date
ln -s data prod/date
# TODO
# ln -s /mnt/flash/date/data.executori.org $STAGE/date

# TODO: enable when stable
#./build/configurez-nginx.sh executori.org
