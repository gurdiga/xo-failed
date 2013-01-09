echo 'Setez permisiuni...'

TARGETS=".htusers bnm date"

sudo chown -R www-data $TARGETS
sudo chmod -R g+w $TARGETS
