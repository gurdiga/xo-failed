echo -n 'Pregzipuiesc cod'

files="
  index.html
  css/*.css
  js/*.js
  formulare-încheieri/*.html
"

for file in $files; do
  echo -n '.'
  gzip < $file > $file.gz
done

echo ''
