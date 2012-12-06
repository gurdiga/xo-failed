DOCUMENT_ROOT=`readlink -f $DIR/../../..`
SERVER_NAME=`basename $DOCUMENT_ROOT`
LOGIN='000'
PASSWORD='Verificarea!'
TMP_FILE="/tmp/$(date +%m%d%y%H%M%S)"
DATE="$DOCUMENT_ROOT/date/$LOGIN"

CURL_DEFAULT_ARGS="--insecure --user $LOGIN:$PASSWORD --fail --silent --show-error"


RED="\e[00;31m"
GREEN="\e[00;32m"
RESET_COLOR="\e[00m"

SUCCESS_MARK="✓"
FAIL_MARK="×"


function verifică {
  RETURN_CODE=$?

  if [ $RETURN_CODE -eq 0 ]; then
    echo -e -n " $GREEN$SUCCESS_MARK"
  else
    echo -e -n " $RED$FAIL_MARK"
  fi

  echo -e " $1$RESET_COLOR"
  return $RETURN_CODE
}
