#!/bin/bash

openssl req -new -newkey rsa:2048 -nodes -out executori_org.csr -keyout executori_org.key -subj "/C=MD/ST=/L=Chisinau/O=executori.org/CN=executori.org"
