#!/bin/bash

echo 'Git pull...'

git pull origin master &> .git.log
git reset --hard origin/master &>> .git.log

if [ $? -ne 0 ]; then
  cat .git.log
  exit
fi

echo ''
