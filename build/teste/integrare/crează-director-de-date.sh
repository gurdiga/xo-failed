echo 'Creez director de date...'

sudo mkdir -p $DATE
verifică 'creat'

sudo mkdir -p $DATE/proceduri
verifică 'creat proceduri/'

sudo mkdir -p $DATE/încheieri
verifică 'creat încheieri/'

sudo chown -R www-data:www-data $DATE
verifică 'chown'
