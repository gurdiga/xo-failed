#!/bin/bash

files="
  index.html
  css/style.css
  css/raport.css
  js/action.js
  js/lib.js
  js/raport.js
"

for file in $files; do
  cat $file | gzip > $file.gz
done
