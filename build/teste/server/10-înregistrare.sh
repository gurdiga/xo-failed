echo 'Înregistrarea...'

DATE_INREGISTRARE="build/teste/server/fixturi/înregistrare.json"
LOGIN_DE_TEST=999

# -----------------------------------------
function elimină() {
  echo "eliminăm $LOGIN_DE_TEST"

}
# -----------------------------------------

curl \
  $CURL_DEFAULT_ARGS_ANON \
  --include \
  --output $TMP_FILE \
  --request PUT \
  --data @$DATE_INREGISTRARE \
  https://$SERVER_NAME/register

verifică 'răspuns OK neautentificat'

grep "^$LOGIN_DE_TEST:" $DOCUMENT_ROOT/.htusers &> /dev/null
verifică "găsit login $LOGIN_DE_TEST în .htusers"

# teardown
sudo cp --preserve $DOCUMENT_ROOT/.htusers $DOCUMENT_ROOT/.htusers.bak
sed --in-place \
  --expression "/^$LOGIN_DE_TEST:/d" \
  $DOCUMENT_ROOT/.htusers

sudo chown --reference $DOCUMENT_ROOT/.htusers.bak $DOCUMENT_ROOT/.htusers
sudo chmod --reference $DOCUMENT_ROOT/.htusers.bak $DOCUMENT_ROOT/.htusers
sudo rm $DOCUMENT_ROOT/.htusers.bak

grep "^$LOGIN_DE_TEST:" $DOCUMENT_ROOT/.htusers &> /dev/null 
test $? -eq 1 # grep a întors 1: nu a găsit ce a căutat
verifică "eliminat login $LOGIN_DE_TEST"

#TODO de verificat trimiterea de email?

rm $TMP_FILE
