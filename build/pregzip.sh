#!/bin/bash

files="
  index.html
  css/style.css
  css/raport.css
  js/action.js
  js/lib.js
  js/raport.js
"

echo "Pregzipping..."

for file in $files; do
  echo "- $file"
  cat $file | gzip > $file.gz
done

echo 'OK'
