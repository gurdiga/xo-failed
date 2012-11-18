#!/bin/bash

echo 'Cont utilizator de test...'

php $DOCUMENT_ROOT/bin/htusers.php $LOGIN $PASSWORD >> $DOCUMENT_ROOT/.htusers
grep "$LOGIN:" $DOCUMENT_ROOT/.htusers &> /dev/null
verifică 'creat'
