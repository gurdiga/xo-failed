#!/bin/bash

set -e

for step in `dirname $0`/[0-9]*.sh ; do
  . $step
done
