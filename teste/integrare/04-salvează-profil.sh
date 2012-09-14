#!/bin/bash

echo 'Salvare profil...'

SURSA="`dirname $0`/fixturi/profil.json"
DESTINATIA="date/$LOGIN/profil.json"

sudo rm -f $DESTINATIA

curl \
  --request POST \
  --insecure \
  --data @$SURSA \
  --user $LOGIN:$PASSWORD \
  https://$SERVER_NAME/$DESTINATIA

verifică 'trimis datele'

file $DESTINATIA > /dev/null
verifică 'salvat'
