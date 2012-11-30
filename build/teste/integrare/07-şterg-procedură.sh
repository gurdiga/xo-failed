echo 'Şterge procedura...'

DESTINATIA="date/$LOGIN/proceduri/-1/"

curl $CURL_DEFAULT_ARGS \
  --request DELETE \
  https://$SERVER_NAME/$DESTINATIA
verifică 'trimis request'

test ! -d $DOCUMENT_ROOT/$DESTINATIA
verifică 'directorul procedurii nu există'
