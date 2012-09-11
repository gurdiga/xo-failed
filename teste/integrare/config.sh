#!/bin/bash

set -e

SERVER_NAME=$(basename `pwd`)
LOGIN='007'
PASSWORD='Executarea!'
TMP_FILE="/tmp/$(date +%m%d%y%H%M%S)"

CURL_DEFAULT_ARGS="--insecure --user $LOGIN:$PASSWORD --fail"

function verifică {
  if [ $? -eq 0 ]; then
    echo -n '✓'
  else
    echo -n '×'
  fi

  echo " $1"
}
