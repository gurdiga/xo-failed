#!/bin/bash

echo 'Autentificarea...'

. `dirname $0`/config.sh


curl \
  $CURL_DEFAULT_ARGS \
  --include \
  --silent \
  --output $TMP_FILE \
  https://$SERVER_NAME/bin/login.php

verifică 'răspuns OK'

grep '^Set-Cookie: login=007; path=/' $TMP_FILE > /dev/null
verifică 'cookie'

rm $TMP_FILE
