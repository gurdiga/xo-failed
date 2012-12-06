files="
  index.html
  css/*.css
  js/*.js
  formulare/*.html
  bnm/*.js
"

echo -n 'Pregzipuiesc cod'

for file in $files; do
  echo -n '.'
  gzip < $file > $file.gz
done

echo ''
