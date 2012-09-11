echo 'Update config file...'

SERVER_NAME=$(basename `pwd`)

cp nginx.vhost.conf.general nginx.vhost.conf
sed -i "s/SERVER_NAME/$SERVER_NAME/g" nginx.vhost.conf
sudo /etc/init.d/nginx reload
