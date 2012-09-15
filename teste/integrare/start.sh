#!/bin/bash

DIR=`dirname $0`

. $DIR/config.sh
. $DIR/pregăteşte-utilizator.sh
. $DIR/crează-director-de-date.sh

for step in $DIR/[0-9]*.sh ; do
  . $step
done | tee $DIR/log

. $DIR/şterge-utilizator.sh
. $DIR/şterge-director-de-date.sh

echo '================='
fgrep $FAIL_MARK $DIR/log > /dev/null
test $? -eq 1
verifică 'TOTUL E OK'
