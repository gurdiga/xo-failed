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

  if [ $? -eq 0 ]; then
    rm $SURSA.original
  else
    echo "[\033[0;33m\]N-am putut minifica $SURSA.\[\033[0;37m\]"
    mv $SURSA.original $SURSA
  fi
}

minifică "js/action.js"
minifică "js/încheiere.js"

# concatenează lib.js cu action.js
rm -f js/action-*.js*
cat \
  js/lib/jquery-2.0.2.min.js \
  lib/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js \
  js/lib.js \
  js/action.js \
  > js/one.js
mv js/one.js js/action-$TIMESTAMP.js

grep --fixed-strings --invert-match \
  -e '<script defer src="/js/lib/jquery-2.0.2.min.js"></script>' \
  -e '<script defer src="/js/lib/jquery-migrate-1.2.1.min.js"></script>' \
  -e '<script defer src="/lib/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js"></script>' \
  -e '<script defer src="/js/lib.js"></script>' \
  index.html > index.html.1

mv index.html.1 index.html

sed -i "s/action.js/action-$TIMESTAMP.js/g" index.html


echo ''
