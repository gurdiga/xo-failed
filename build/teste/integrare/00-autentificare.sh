#!/bin/bash

echo 'Autentificarea...'

curl \
  $CURL_DEFAULT_ARGS \
  --include \
  --silent \
  --output $TMP_FILE \
  https://$SERVER_NAME/login

verifică 'răspuns OK'

grep "^Set-Cookie: login=$LOGIN; path=/" $TMP_FILE > /dev/null
verifică 'cookie'

rm $TMP_FILE
