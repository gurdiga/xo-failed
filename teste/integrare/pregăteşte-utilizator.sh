#!/bin/bash

echo 'Cont utilizator de test...'

grep $LOGIN $DOCUMENT_ROOT/.htusers > /dev/null

if [ $? -eq 1 ]; then
  php $DOCUMENT_ROOT/bin/htusers.php $LOGIN $PASSWORD >> $DOCUMENT_ROOT/.htusers
  verifică 'creat'
else
  true
  verifică 'există'
fi
