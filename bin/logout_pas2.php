<?

include './htusers.php';


delete_user($_SERVER['PHP_AUTH_USER']);
header('WWW-Authenticate: Basic realm="Autentificare"');
