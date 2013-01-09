echo -n 'Concatenez CSS'

cat \
  css/shared.css \
  css/style.css \
  lib/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.min.css \
  > css/one.css

mv css/one.css css/style.css

grep --fixed-strings --invert-match \
  -e '<link type="text/css" rel="stylesheet" href="/lib/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.min.css"/>' \
  -e '<link type="text/css" rel="stylesheet" href="/css/shared.css"/' \
  index.html > index.html.1

mv index.html.1 index.html
