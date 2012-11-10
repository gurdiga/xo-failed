#!/bin/bash

echo 'Verifică permisiuni...'


DIR=date/002
DATE_HTML=$DIR/încheieri/ceva.html
DATE_JSON=$DIR/ceva.json

sudo su www-data -c "mkdir $DIR"
sudo su www-data -c "mkdir $DIR/încheieri"
sudo su www-data -c "touch $DATE_HTML"
sudo su www-data -c "touch $DATE_JSON"


curl $CURL_DEFAULT_ARGS \
  https://$SERVER_NAME/$DATE_HTML &> $TMP_FILE
grep "The requested URL returned error: 403$" $TMP_FILE > /dev/null
verifică 'răspund 403 dacă se cer încheieri străine'


curl $CURL_DEFAULT_ARGS \
  https://$SERVER_NAME/$DATE_JSON &> $TMP_FILE
grep "The requested URL returned error: 403$" $TMP_FILE > /dev/null
verifică 'răspund 403 dacă se cer date străine'


sudo rm -rf $DIR
