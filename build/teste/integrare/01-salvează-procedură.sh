#!/bin/bash

echo 'Salvează procedura...'

SURSA="$DOCUMENT_ROOT/build/teste/integrare/fixturi/procedură.json"
INDEX="$DOCUMENT_ROOT/build/teste/integrare/fixturi/index.json.gz"
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

curl $CURL_DEFAULT_ARGS \
  --include \
  --header 'Accept-Encoding: gzip' \
  --output $TMP_FILE \
  https://$SERVER_NAME/$DESTINATIA
verifică 'se poate descărca'

grep "^Content-Type: application/json; charset=utf-8" $TMP_FILE > /dev/null
verifică 'Content-Type este "application/json; charset=utf-8"'

grep "^Content-Encoding: gzip" $TMP_FILE > /dev/null
verifică 'Content-Encoding este gzip'

file "$DOCUMENT_ROOT/$DESTINATIA.gz" > /dev/null
verifică 'salvat pe disc'

zcat "$DOCUMENT_ROOT/$DESTINATIA.gz" | /usr/bin/diff $SURSA -
verifică 'datele salvate corespund cu cele trimise'

zgrep '^\["-1"' $DOCUMENT_ROOT/date/$LOGIN/proceduri/recente.json.gz > /dev/null
verifică 'procedura e marcată ca recent deschisă'

diff $DOCUMENT_ROOT/date/$LOGIN/proceduri/index.json.gz $INDEX > /dev/null
verifică 'procedura este indexată'
