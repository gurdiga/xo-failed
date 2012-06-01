<?

require './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = $_POST['procedură'];

verifică_login($login);
verifică_dacă_există($procedură);
notează($procedură);

// ==============================

function verifică_dacă_există($procedură) {
  global $login;

  if (!preg_match('|^[SP]?/\d+$|', $procedură)) {
    stop("Număr de procedură invalid: [$procedură]");
  }

  if (!file_exists("../date/$login/proceduri/$procedură")) {
    stop("Nu există procedura: [$login/proceduri/$procedură]");
  }
}

// ------------------------------

function notează($procedură) {
  global $login;

  $target = "../$procedură";
  $link = "../date/$login/proceduri/recente/" . str_replace('/', '-', $procedură);

  symlink($target, $link);
}
