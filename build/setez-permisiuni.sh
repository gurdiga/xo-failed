echo 'Setez permisiuni...'

TARGETS=".htusers bnm date"

sudo chown www-data $TARGETS
sudo chmod g+w $TARGETS
