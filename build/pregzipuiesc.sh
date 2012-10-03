#!/bin/bash

files="
  index.html
  css/shared.css
  css/style.css
  css/încheiere.css
  js/action.js
  js/lib.js
  js/încheiere.js
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
