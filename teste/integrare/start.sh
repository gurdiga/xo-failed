#!/bin/bash

for step in `dirname $0`/[0-9]*.sh ; do
  . $step
done

sudo find `dirname $0`/../../date/001/ -type f -delete
sudo rm -f $TMP_FILE
