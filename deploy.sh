#!/bin/bash

cd /var/www/executori.org
git pull

echo 'Set permissions on .htusers...'
sudo chown www-data .htusers
sudo chmod g+w .htusers

./build/pregzip.sh
