#!/bin/bash

echo 'Git pull...'
git pull origin master >> .git.log 2>&1

if [ $? -ne 0 ]; then
  cat .git.log
  exit
fi

echo ''
