#!/bin/bash

echo 'Salvare profil...'

. `dirname $0`/config.sh


SURSA="`dirname $0`/fixturi/profil.json"
DESTINATIA="date/$LOGIN/profil.json"

curl \
  --request POST \
  --insecure \
  --data @$SURSA \
  --user $LOGIN:$PASSWORD \
  https://$SERVER_NAME/$DESTINATIA

verifică 'trimis datele'

file $DESTINATIA > /dev/null
verifică 'salvat'
