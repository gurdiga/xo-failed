#!/bin/bash

echo 'Salvează încheierea...'

SURSA="$DOCUMENT_ROOT/build/teste/integrare/fixturi/Încheiere-de-test.html"
DESTINATIA_FS="$DOCUMENT_ROOT/date/$LOGIN/încheieri/`basename $SURSA`.gz"

curl $CURL_DEFAULT_ARGS \
  --request POST \
  --data @$SURSA \
  https://$SERVER_NAME/date/$LOGIN/%C3%AEncheieri/%C3%8Encheiere-de-test.html

verifică 'trimis datele'

file $DESTINATIA_FS > /dev/null
verifică 'salvat'

zcat $DESTINATIA_FS | /usr/bin/diff - $SURSA
verifică 'datele salvate corespund cu cele trimise'
