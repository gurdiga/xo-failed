<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = file_get_contents('php://input');
$afişează = true;

verifică_număr($procedură);
verifică_dacă_există($procedură);
notează_ca_recentă($procedură, $afişează);
