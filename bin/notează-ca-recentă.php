<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = $_POST['procedură'];

verifică_login($login);
verifică_număr($procedură);
verifică_dacă_există($procedură);
notează_ca_recentă($procedură);

// ==============================

function verifică_dacă_există($procedură) {
  global $login;

  if (!file_exists("../date/$login/proceduri/$procedură")) {
    stop("Nu există procedura: [$login/proceduri/$procedură]");
  }
}
