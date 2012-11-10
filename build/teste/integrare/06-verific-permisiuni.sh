#!/bin/bash

echo 'Verifică permisiuni...'

DIR=date/002
DATE_JSON=$DIR/ceva.json
DATE_HTML=$DIR/ceva.json

sudo su www-data -c "mkdir $DIR"
sudo su www-data -c "touch $DATE_JSON"
sudo su www-data -c "touch $DATE_HTML"

curl $CURL_DEFAULT_ARGS \
  https://$SERVER_NAME/$DATE_HTML &> $TMP_FILE
grep "The requested URL returned error: 403$" $TMP_FILE > /dev/null
verifică 'răspund 403 dacă cer date HTML străine'

curl $CURL_DEFAULT_ARGS \
  https://$SERVER_NAME/$DATE_JSON &> $TMP_FILE
grep "The requested URL returned error: 403$" $TMP_FILE > /dev/null
verifică 'răspund 403 dacă cer date JSON străine'

curl $CURL_DEFAULT_ARGS \
  --output /dev/null \
  https://$SERVER_NAME/$DIR/
verifică 'răspund 200 dacă cer altceva străin'

sudo rm -rf $DIR
