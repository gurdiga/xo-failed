#!/bin/bash

set -e

unzip executori_org.zip
cp executori_org.csr executori_org.csr.bak
cat executori_org.csr.bak PositiveSSLCA2.crt AddTrustExternalCARoot.crt > executori_org.csr
