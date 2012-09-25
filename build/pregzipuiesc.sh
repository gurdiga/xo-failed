#!/bin/bash

files="
  index.html
  css/style.css
  css/raport.css
  js/action.js
  js/lib.js
  js/raport.js
"

echo "Pregzipuiesc cod..."

for file in $files; do
  echo "- $file"
  cat $file | gzip > $file.gz
done


echo "Pregzipuiesc date..."

for file in `find date -type f ! -name '*.gz'`; do
  echo "- $file"
  gzip $file
done


echo ''
