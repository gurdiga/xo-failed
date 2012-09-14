#!/bin/bash

echo 'Salvează procedura...'

. `dirname $0`/config.sh

SURSA="`dirname $0`/fixturi/procedură.json"
DESTINATIA="date/$LOGIN/proceduri/-1.json"

sudo rm -f $DESTINATIA

curl $CURL_DEFAULT_ARGS \
  --request POST \
  --data @$SURSA \
  https://$SERVER_NAME/$DESTINATIA

verifică 'trimis datele'


file $DESTINATIA > /dev/null
verifică 'salvat'

/usr/bin/diff $SURSA $DESTINATIA
verifică 'datele salvate corespund cu cele trimise'

/bin/grep '^\["-1"' date/$LOGIN/proceduri/recente.json > /dev/null
verifică 'procedura e marcată ca recent deschisă'
