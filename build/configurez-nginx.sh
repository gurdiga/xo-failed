echo 'Configurez nginx...'

# SERVER_NAME şi ROOT se ia din mediu

sed \
  -e "s|%%SERVER_NAME%%|$SERVER_NAME|g" \
  -e "s|%%ROOT%%|$ROOT|g" \
  nginx.vhost.conf.template > nginx.vhost.conf

# nu restarta dacă NORESTART e definit în mediu
if [ -z "$NORESTART" ]; then
  sudo /etc/init.d/nginx reload
fi
