#!/bin/bash

echo 'Cont utilizator de test...'

php $DOCUMENT_ROOT/bin/htusers.php $LOGIN $PASSWORD >> $DOCUMENT_ROOT/.htusers
verifică 'creat'
cat $DOCUMENT_ROOT/.htusers
