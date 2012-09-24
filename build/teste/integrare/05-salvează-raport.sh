#!/bin/bash

echo 'Salvează raportul...'

NUME_RAPORT="Raport-de-test.html"
SURSA="`dirname $0`/fixturi/$NUME_RAPORT"
DESTINATIA="date/$LOGIN/rapoarte/$NUME_RAPORT"

curl $CURL_DEFAULT_ARGS \
  --request POST \
  --data @$SURSA \
  https://$SERVER_NAME/$DESTINATIA

verifică 'trimis datele'


file "$DESTINATIA.gz" > /dev/null
verifică 'salvat'

zcat $DESTINATIA | /usr/bin/diff - $SURSA
verifică 'datele salvate corespund cu cele trimise'
