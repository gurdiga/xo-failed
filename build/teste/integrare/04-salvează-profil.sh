echo 'Salvare profil...'

SURSA="`dirname $0`/fixturi/profil.json"
DESTINATIA="date/$LOGIN/profil.json"

curl \
  $CURL_DEFAULT_ARGS \
  --request PUT \
  --insecure \
  --data @$SURSA \
  --user $LOGIN:$PASSWORD \
  https://$SERVER_NAME/$DESTINATIA

verifică 'trimis datele'

file "$DESTINATIA.gz" > /dev/null
verifică 'salvat'
