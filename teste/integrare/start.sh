#!/bin/bash

DIR=`dirname $0`

. $DIR/config.sh
. $DIR/pregăteşte-utilizator.sh
. $DIR/crează-director-de-date.sh

for step in $DIR/[0-9]*.sh ; do
  . $step
done

sudo rm -rf $DATE
sudo rm -f $TMP_FILE
