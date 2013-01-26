echo 'Configurez nginx...'

SERVER_NAME=${SERVER_NAME-$(basename `pwd`)}
echo $SERVER_NAME

cp nginx.vhost.conf.template nginx.vhost.conf
sed -i "s/%%SERVER_NAME%%/$SERVER_NAME/g" nginx.vhost.conf
sudo /etc/init.d/nginx reload
