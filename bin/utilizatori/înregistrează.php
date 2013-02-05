<?

require 'htusers.php';


$date = json_decode($conţinut, true);

if (
    !isset($date['login']) ||
    !isset($date['email']) ||
    !filter_var($date['email'], FILTER_VALIDATE_EMAIL)
  ) {
  header('HTTP/1.1 409 Conflict');
}

$login = $date['login'];
$email = $date['email'];

if (user_registered($login)) {
  header('HTTP/1.1 409 Conflict');
} else {
  $password = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 15);
  register_user($login, $password);
  # TODO de trimis email la adresa indicată cu detalii despre cont şi parolă
}
