#!/bin/sh

echo -n 'PHP lint'

for script in bin/*; do
  echo -n '.'
  php -l $script > /tmp/php-l.log
  
  if [ $? -ne 0 ]; then
    cat /tmp/php-l.log
    exit 1
  fi
done

echo ''
