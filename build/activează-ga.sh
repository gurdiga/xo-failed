echo -n 'Activez GA'

grep --fixed-strings --invert-match \
  -e 'GA BEGIN' \
  -e 'GA END' \
  index.html > index.html.1

mv index.html.1 index.html

echo '.'
