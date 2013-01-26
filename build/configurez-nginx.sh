echo 'Configurez nginx...'

# SERVER_NAME şi ENV se ia din mediu

cp nginx.vhost.conf.template nginx.vhost.conf
sed -i \
  -e "s/%%SERVER_NAME%%/$SERVER_NAME/g" \
  -e "s/%%ENV%%/$ENV/g" \
  nginx.vhost.conf

# nu restarta dacă NORESTART e definit în mediu
if [ ! -z "$NORESTART" ]; then
  sudo /etc/init.d/nginx reload
fi
