<?

$login = $_SERVER['PHP_AUTH_USER'];
$procedură = $_POST;

verifică_login($login);
verifică_date($procedură);
salvează($procedură);


// ==============================

function verifică_login($login) {
  if (!preg_match('/^\d+$/', $login)) {
    error_log("Login invalid: [$login]");
    die();
  }

  if (!is_dir("../date/$login")) {
    error_log("Nu există director pentru date: [$login]");
    die();
  }
}

// ------------------------------

function verifică_date($procedură) {
  if (!preg_match('/^\d+$/', $procedură['număr'])) {
    error_log("Număr de procedură invalid: [{$procedură['număr']}]");
    die();
  }

  if (!preg_match('/^[-sp]$/', $procedură['tip'])) {
    error_log("Tip de procedură invalid: [{$procedură['tip']}]");
    die();
  }
}

// ------------------------------

function salvează($procedură) {
  global $login;

  $număr = $procedură['număr'];
  $tip = $procedură['tip'];

  file_put_contents("../date/$login/proceduri/$tip/$număr", json_encode($procedură));
}
