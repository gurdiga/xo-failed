#!/bin/bash

function verifică {
  RETURN_CODE=$?
  MESAJ=$1

  if [ $RETURN_CODE -ne 0 ]; then
    echo -e "\n$MESAJ"
    exit $RETURN_CODE
  fi
}

for formular in formulare/*.părţi; do
  for parte in $formular/*.html; do
    tidy -quiet -errors -utf8 -xml < $parte;
    verifică $parte
  done;

  DESTINATIE=${formular/.părţi/.html}
  php $formular/conţinut.html > $DESTINATIE
  verifică $DESTINATIE

  tidy -quiet -errors -utf8 -xml < $DESTINATIE && echo -n "."
  verifică $formular
done
