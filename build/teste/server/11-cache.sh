echo 'HTTP headers'

EXPECTED_HEADERS='
Cache-Control: must-revalidate
X-Frame-Options: SAMEORIGIN
Last-Modified: 
Content-Type: 
Content-Length: 
'

curl \
  $CURL_DEFAULT_ARGS_ANON \
  --include \
  --output $TMP_FILE \
  https://$SERVER_NAME/

IFS_OLD=$IFS
IFS=$'\n'

for header in $EXPECTED_HEADERS; do
  grep "$header" $TMP_FILE &> /dev/null
  verifică "$header"
done

IFS=$IFS_OLD
rm $TMP_FILE
