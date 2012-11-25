#!/bin/bash

echo 'Minific JS...'

SURSA="js/action.js"

mv $SURSA $SURSA.original

curl -s \
  -d compilation_level=SIMPLE_OPTIMIZATIONS \
  -d output_format=text \
  -d output_info=compiled_code \
  -d charset=utf-8 \
 --data-urlencode "js_code@$SURSA.original" \
 http://closure-compiler.appspot.com/compile > $SURSA

rm $SURSA.original

echo ''
