#!/bin/bash

echo 'Cont utilizator de test...'

php $DOCUMENT_ROOT/bin/htusers.php $LOGIN $PASSWORD
php $DOCUMENT_ROOT/bin/htusers.php $LOGIN $PASSWORD >> $DOCUMENT_ROOT/.htusers
grep "$LOGIN:" $DOCUMENT_ROOT/.htusers
verifică 'creat'

echo "-================ $DOCUMENT_ROOT/.htusers"
cat $DOCUMENT_ROOT/.htusers
