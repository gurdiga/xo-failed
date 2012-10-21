#!/bin/bash

echo 'Salvează procedura...'

SURSA="`dirname $0`/fixturi/procedură.json"
INDEX="`dirname $0`/fixturi/index.json.gz"
DESTINATIA="date/$LOGIN/proceduri/-1.json"

curl $CURL_DEFAULT_ARGS \
  --request POST \
  --data @$SURSA \
  https://$SERVER_NAME/$DESTINATIA
verifică 'trimis datele'

curl $CURL_DEFAULT_ARGS \
  --include \
  --output $TMP_FILE \
  https://$SERVER_NAME/date/$LOGIN/
grep "^Cache-Control: private" $TMP_FILE > /dev/null
verifică 'datele sunt marcate private pentru proxy-uri'


file "$DESTINATIA.gz" > /dev/null
verifică 'salvat'

zcat "$DESTINATIA.gz" | /usr/bin/diff $SURSA -
verifică 'datele salvate corespund cu cele trimise'

zgrep '^\["-1"' date/$LOGIN/proceduri/recente.json.gz > /dev/null
verifică 'procedura e marcată ca recent deschisă'

diff date/$LOGIN/proceduri/index.json.gz $INDEX > /dev/null
verifică 'procedura este indexată'
