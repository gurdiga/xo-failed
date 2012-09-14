#!/bin/bash

SERVER_NAME=$(basename `pwd`)
LOGIN='001'
PASSWORD='Verificarea!'
TMP_FILE="/tmp/$(date +%m%d%y%H%M%S)"

DOCUMENT_ROOT="$DIR/../.."
DATE="$DOCUMENT_ROOT/date/$LOGIN"

CURL_DEFAULT_ARGS="--insecure --user $LOGIN:$PASSWORD --fail"

function verifică {
  RETURN_CODE=$?

  local RED="\e[00;31m"
  local GREEN="\e[00;32m"
  local RESET_COLOR="\e[00m"

  if [ $RETURN_CODE -eq 0 ]; then
    echo -e -n " $GREEN✓"
  else
    echo -e -n " $RED×"
  fi

  echo -e " $1$RESET_COLOR"
}
