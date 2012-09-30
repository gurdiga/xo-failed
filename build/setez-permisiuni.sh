echo 'Setez permisiuni...'

echo '- .htusers'
sudo chown www-data .htusers
sudo chmod g+w .htusers

echo '- bnm/'
sudo chown -R www-data bnm
sudo chmod -R g+w bnm

echo '- date/'
sudo chown -R www-data date
sudo chmod -R g+w date

echo ''
