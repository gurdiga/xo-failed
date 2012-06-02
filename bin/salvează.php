<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = $_POST;

verifică_login($login);
verifică_date($procedură);
salvează($procedură);


// ==============================

function verifică_date($procedură) {
  if (!preg_match('/^\d+$/', $procedură['număr'])) {
    stop("Număr de procedură invalid: [{$procedură['număr']}]");
  }

  if (!preg_match('/^[SP]?/', $procedură['tip'])) {
    stop("Tip de procedură invalid: [{$procedură['tip']}]");
  }
}

// ------------------------------

function salvează($procedură) {
  global $login;

  $număr = $procedură['număr'];
  $tip = $procedură['tip'];

  file_put_contents("../date/$login/proceduri/$tip/$număr", json_encode($procedură));

  $_POST['procedură'] = "$tip/$număr";
  require './notează-ca-recentă.php';
}
