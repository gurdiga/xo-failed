#!/bin/bash

echo -n 'Minific JS'

function minifică() {
  SURSA=$1

  echo -n '.'
  mv $SURSA $SURSA.original

  curl -s \
    -d compilation_level=SIMPLE_OPTIMIZATIONS \
    -d output_format=text \
    -d output_info=compiled_code \
    -d charset=utf-8 \
    --data-urlencode "js_code@$SURSA.original" \
    http://closure-compiler.appspot.com/compile | \
  sed \
    -e 's/\\u0103/ă/g' \
    -e 's/\\u00ee/î/g' \
    -e 's/\\u00ce/Î/g' \
    -e 's/\\u0163/ţ/g' \
    -e 's/\\u015f/ş/g' \
    -e 's/\\u015e/Ş/g' \
  > $SURSA

  rm $SURSA.original
}

minifică "js/action.js"
minifică "js/încheiere.js"

echo ''
