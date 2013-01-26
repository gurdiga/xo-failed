#!/bin/bash

set -e

ROOT=/var/www/testing.executori.org
sudo mkdir -p $ROOT

cd $ROOT
sudo chown `whoami`:`whoami` . 

if [ ! -d data ]; then
  mkdir -p data
  git clone git@bitbucket.org:gurdiga/data.executori.org.git --depth 1 data
fi

mkdir -p releases
RELEASE=releases/`date +'%Y%m%d%H%M%S'`
git clone git@bitbucket.org:gurdiga/executori.git --depth 0 $RELEASE

ln -s $RELEASE stage
cd $RELEASE

export SERVER_NAME="executori.org"
export ENV=stage
make build

# TODO
# ln -s /mnt/flash/date/data.executori.org $STAGE/date

# TODO: enable when stable
#./build/configurez-nginx.sh executori.org
