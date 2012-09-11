#!/bin/bash

echo 'Notare ca recentă...'

. `dirname $0`/config.sh

NUMAR='-1'
JSON="date/$LOGIN/proceduri/recente.json"

curl $CURL_DEFAULT_ARGS \
  --request POST \
  --include \
  --data $NUMAR \
  --silent \
  --output $TMP_FILE \
  https://$SERVER_NAME/$JSON

verifică 'răspuns OK'

grep "^\[\"$NUMAR\"" $JSON > /dev/null
verifică 'notat'

rm $TMP_FILE
