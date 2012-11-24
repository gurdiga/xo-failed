#!/bin/bash

files="
  index.html
  css/shared.css
  css/style.css
  css/încheiere.css
  js/action.js
  js/lib.js
  js/încheiere.js
  formulare/*.html
  bnm/current.js
  bnm/rata_de_bază.js
"

echo "Pregzipuiesc cod..."

for file in $files; do
  echo "- $file"
  gzip < $file > $file.gz
done

echo ''


echo "Pregzipuiesc date..."
sudo su www-data -c 'gzip -rf date/[0-9]*'
echo ''
