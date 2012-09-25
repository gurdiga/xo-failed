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

echo ''


echo "Pregzipuiesc date..."
sudo su www-data -c 'gzip -rf date'
echo ''
