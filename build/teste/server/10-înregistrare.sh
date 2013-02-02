echo 'Înregistrarea...'

curl \
  $CURL_DEFAULT_ARGS_ANON \
  --include \
  --silent \
  --output $TMP_FILE \
  --request PUT \
  --data login=001 \
  --data email=test@test.com \
  https://$SERVER_NAME/register

verifică 'răspuns OK'

#grep "^Set-Cookie: login=$LOGIN; path=/" $TMP_FILE > /dev/null
#verifică 'cookie'

rm $TMP_FILE
