#!/bin/bash

echo 'Git pull...'

git pull origin master
git checkout master
git reset --hard origin/master

echo ''
