<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = file_get_contents('php://input');

verifică_login($login);
verifică_număr($procedură);
verifică_dacă_există($procedură);
notează_ca_recentă($procedură, true);

// ==============================

function verifică_dacă_există($procedură) {
  global $login;

  if (!file_exists("../date/$login/proceduri/$procedură.json")) {
    stop("Nu există procedura: [$login/proceduri/$procedură.json]");
  }
}
