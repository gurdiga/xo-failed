echo 'Configurez nginx...'

# SERVER_NAME şi ROOT se ia din mediu

if [ -z "$SERVER_NAME" ]; then
  echo "Eroare: variabila SERVER_NAME nu e setată."
  exit 1
fi

if [ -z "$ROOT" ]; then
  echo "Eroare: variabila ROOT nu e setată."
  exit 1
fi

php -n -d include_path=nginx.conf.d nginx.vhost.conf.template > nginx.vhost.conf

# nu restarta dacă NORESTART e definit în mediu
if [ -z "$NORESTART" ]; then
  sudo /etc/init.d/nginx reload
fi
