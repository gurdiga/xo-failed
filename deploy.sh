#!/bin/bash

cd /var/www/executori.org
git pull

./build/pregzip.sh
