<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = $_POST;

verifică_login($login);
verifică_număr($procedură);
salvează($procedură);
reindexează($procedură);


// ==============================

function salvează($procedură) {
  file_put_contents(cale($procedură), json_encode($procedură));

  $_POST['procedură'] = $procedură['număr'];

  require './notează-ca-recentă.php';
}

// ------------------------------

function reindexează() {
  // generează un JSON indexat după nume, IDNP, denumire, IDNO
}
