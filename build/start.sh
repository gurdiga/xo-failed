#!/bin/bash

if [ -f ./build/env.sh ]; then
  . ./build/env.sh
fi

. ./build/setez-permisiuni.sh
. ./build/concatenez-css.sh
. ./build/minific-js.sh
. ./build/activează-ga.sh
. ./build/pregzipuiesc.sh
. ./build/configurez-nginx.sh
. ./build/teste/server/start.sh
