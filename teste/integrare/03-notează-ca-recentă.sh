#!/bin/bash

echo 'Proceduri recente...'

NUMAR='-1'
JSON="date/$LOGIN/proceduri/recente.json"
RASPUNS=$TMP_FILE

sudo rm -f $JSON

curl $CURL_DEFAULT_ARGS \
  --request POST \
  --data $NUMAR \
  --silent \
  --output $RASPUNS \
  https://$SERVER_NAME/$JSON

verifică 'răspuns OK'

grep "^\[\"$NUMAR\"" $JSON > /dev/null
verifică 'notat'

diff --ignore-all-space $RASPUNS $JSON > /dev/null
verifică 'răspuns corect'

sudo rm $RASPUNS
