#!/bin/bash

TIMESTAMP=`date +'%Y%m%d%H%M%S'`
RELEASE=executori.org.$TIMESTAMP
STAGE=stage.executori.org

cd /var/www
mkdir $RELEASE
git clone ssh://git@bitbucket.org/gurdiga/executori.git --depth 0 $RELEASE

unlink $STAGE
ln -s $RELEASE $STAGE
cd $STAGE
make build

# TODO: De curăţat /css şi /js înainte de concatenare

# TODO
# ln -s /mnt/flash/date/data.executori.org $STAGE/date

# TODO: enable when stable
#./build/configurez-nginx.sh executori.org
