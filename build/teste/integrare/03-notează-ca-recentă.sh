#!/bin/bash

echo 'Proceduri recente...'

NUMAR='-1'
JSON="date/$LOGIN/proceduri/recente.json"
RASPUNS=$TMP_FILE

curl $CURL_DEFAULT_ARGS \
  --request PUT \
  --data $NUMAR \
  --silent \
  --output $RASPUNS \
  https://$SERVER_NAME/$JSON

verifică 'răspuns OK'

zgrep "^\[$NUMAR" "$DOCUMENT_ROOT/$JSON.gz" > /dev/null
verifică 'notat'

zcat "$DOCUMENT_ROOT/$JSON.gz" | diff $RASPUNS - > /dev/null
verifică 'răspuns corect'

sudo rm $RASPUNS
