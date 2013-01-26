echo -n 'Minific JS'

TIMESTAMP=`date +'%F-%H-%m-%M'`

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

# concatenează lib.js cu action.js
rm js/action-*.js*
cat \
  js/lib/jquery-1.8.js \
  lib/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js \
  js/lib.js \
  js/action.js \
  > js/one.js
mv js/one.js js/action-$TIMESTAMP.js

grep --fixed-strings --invert-match \
  -e '<script defer src="/js/lib/jquery-1.8.js"></script>' \
  -e '<script defer src="/lib/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js"></script>' \
  -e '<script defer src="/js/lib.js"></script>' \
  index.html > index.html.1

mv index.html.1 index.html

sed -i "s/action.js/action-$TIMESTAMP.js/g" index.html


echo ''
