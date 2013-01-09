echo -n 'Concatenez CSS.'

TIMESTAMP=`date +'%F-%H-%m-%M'`

cat \
  css/jquery-ui-1.9.2.custom.min.css \
  css/shared.css \
  css/style.css \
  > css/one.css

mv css/one.css css/style-$TIMESTAMP.css

echo -n '.'

grep --fixed-strings --invert-match \
  -e '<link type="text/css" rel="stylesheet" href="/css/jquery-ui-1.9.2.custom.min.css"/>' \
  -e '<link type="text/css" rel="stylesheet" href="/css/shared.css"/' \
  index.html > index.html.1

mv index.html.1 index.html

echo -n '.'

sed -i "s/style.css/style-$TIMESTAMP.css/g" index.html


echo ''
