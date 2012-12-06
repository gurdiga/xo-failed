#!/bin/sh

set -e

echo -n 'Bash lint'

scripts=`find . -name '*.sh'`

for script in $scripts; do
  echo -n '.'
  bash -n $script
done

echo ''
