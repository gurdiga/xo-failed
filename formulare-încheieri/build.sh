#!/bin/bash

function verifică {
  RETURN_CODE=$?
  MESAJ=$1

  if [ $RETURN_CODE -ne 0 ]; then
    echo -e "\n$MESAJ"
    exit $RETURN_CODE
  fi
}

cd formulare-încheieri
rm -f *.html

for formular in *.părţi; do
  for parte in $formular/*.html; do
    tidy -quiet -errors -utf8 -xml < $parte;
    verifică formulare-încheieri/$parte
  done;

  DESTINATIE=${formular/.părţi/.html}
  php $formular/conţinut.html > $DESTINATIE
  verifică formulare-încheieri/$DESTINATIE

  tidy -quiet -errors -utf8 -xml < $DESTINATIE && echo -n "."
  verifică formulare-încheieri/$formular

  BASENAME=${formular/.părţi/}
  ln -sf $DESTINATIE "$BASENAME-P.html"
  ln -sf $DESTINATIE "$BASENAME-pecuniar.html"
  ln -sf $DESTINATIE "$BASENAME-nonpecuniar.html"
  ln -sf $DESTINATIE "$BASENAME-Specuniar.html"
  ln -sf $DESTINATIE "$BASENAME-Snonpecuniar.html"
done
