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


file $DESTINATIA > /dev/null
verifică 'salvat'

# `echo` hack here is to prevent diff happy about "\ No newline at end of file"
echo -n "$( < $SURSA )" | /usr/bin/diff - $DESTINATIA
verifică 'datele salvate corespund cu cele trimise'

sudo rm -f $DESTINATIA
