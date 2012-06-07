<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = $_POST;

verifică_login($login);
verifică_date($procedură);
salvează($procedură);
reindexează($procedură);


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
  file_put_contents(cale($procedură), json_encode($procedură));

  $_POST['procedură'] = $procedură['tip'] . '-' . $procedură['număr'];

  require './notează-ca-recentă.php';
}

// ------------------------------

function reindexează() {
  // generează un JSON indexat după nume, IDNP, denumire, IDNO
}
