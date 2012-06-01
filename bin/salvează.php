<?

require './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = $_POST;

verifică_login($login);
verifică_date($procedură);
salvează($procedură);


// ==============================

function verifică_login($login) {
  if (!preg_match('/^\d+$/', $login)) {
    stop("Login invalid: [$login]");
  }

  if (!is_dir("../date/$login")) {
    stop("Nu există director pentru date: [$login]");
  }
}

// ------------------------------

function verifică_date($procedură) {
  if (!preg_match('/^\d+$/', $procedură['număr'])) {
    stop("Număr de procedură invalid: [{$procedură['număr']}]");
  }

  if (!preg_match('/^[SP]/', $procedură['tip'])) {
    stop("Tip de procedură invalid: [{$procedură['tip']}]");
  }
}

// ------------------------------

function salvează($procedură) {
  global $login;

  $număr = $procedură['număr'];
  $tip = $procedură['tip'];

  file_put_contents("../date/$login/proceduri/$tip/$număr", json_encode($procedură));
}
