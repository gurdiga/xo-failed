<?

require './htusers.php';


$login = "logout{$_SERVER['PHP_AUTH_USER']}" . str_replace('.', '', (string)microtime(true));
$password = 'secret';

register_user($login, $password);

echo base64_encode("$login:$password");
