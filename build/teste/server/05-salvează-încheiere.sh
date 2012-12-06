echo 'Salvează încheierea...'

SURSA="$DIR/fixturi/Încheiere-de-test.html"
DESTINATIA_FS="$DOCUMENT_ROOT/date/$LOGIN/proceduri/-1/încheieri/`basename $SURSA`.gz"

curl $CURL_DEFAULT_ARGS \
  --request PUT \
  --data @$SURSA \
  https://$SERVER_NAME/date/$LOGIN/proceduri/-1/%C3%AEncheieri/%C3%8Encheiere-de-test.html

verifică 'trimis datele'

file $DESTINATIA_FS > /dev/null
verifică 'salvat'

zcat $DESTINATIA_FS | /usr/bin/diff - $SURSA
verifică 'datele salvate corespund cu cele trimise'
