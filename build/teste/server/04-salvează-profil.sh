echo 'Salvare profil...'

SURSA="$DIR/fixturi/profil.json"
DESTINATIA="date/$LOGIN/profil.json"

curl \
  $CURL_DEFAULT_ARGS \
  --request PUT \
  --insecure \
  --data @$SURSA \
  --user $LOGIN:$PASSWORD \
  https://$SERVER_NAME/$DESTINATIA > /dev/null

verifică 'trimis datele'

file "$DESTINATIA.gz" > /dev/null
verifică 'salvat'
