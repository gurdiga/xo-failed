echo 'Configurez nginx...'

SERVER_NAME=${1-$(basename `pwd`)}

cp nginx.vhost.conf.template nginx.vhost.conf
sed -i "s/%%SERVER_NAME%%/$SERVER_NAME/g" nginx.vhost.conf
sudo /etc/init.d/nginx reload
