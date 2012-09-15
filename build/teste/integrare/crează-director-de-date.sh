#!/bin/bash

echo 'Creez director de date...'

sudo mkdir -p $DATE
verifică 'creat'

sudo chown -R www-data:www-data $DATE
verifică 'chown'
