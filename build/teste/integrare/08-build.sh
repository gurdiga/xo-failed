echo 'Verifică build/...'

curl $CURL_DEFAULT_ARGS \
  --include \
  https://$SERVER_NAME/build/ &> $TMP_FILE
verifică 'pot accesa'

grep "^Cache-Control: no-cache, max-age=0, no-store" $TMP_FILE > /dev/null
verifică 'nu permite cache-uirea'
