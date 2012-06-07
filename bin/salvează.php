<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = $_POST;

verifică_login($login);
verifică_date($procedură);
salvează($procedură);
#indexează($procedură);


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

  $_POST['procedură'] = $procedură['tip'] . '/' . $procedură['număr'];

  require './notează-ca-recentă.php';
}

// ------------------------------

function indexează($procedură) {
  global $login;

  $mode = 0755;

  şterge_referinţe_precedente($procedură, $login);

  $creditor = $procedură['creditor'];

  if (isset($creditor['denumire'])) indexează_după($procedură, $creditor, 'creditor', 'denumire');
  if (isset($creditor['idno'])) indexează_după($procedură, $creditor, 'creditor', 'idno');

  if (isset($procedură['persoane-terţe'])) {
    foreach ($procedură['persoane-terţe'] as $persoană_terţă) {
      if (isset($persoană_terţă['denumire'])) indexează_după($procedură, $persoană_terţă, 'persoană-terţă', 'denumire');
      if (isset($persoană_terţă['idno'])) indexează_după($procedură, $persoană_terţă, 'persoană-terţă', 'idno');
      if (isset($persoană_terţă['nume'])) indexează_după($procedură, $persoană_terţă, 'persoană-terţă', 'nume');
      if (isset($persoană_terţă['idnp'])) indexează_după($procedură, $persoană_terţă, 'persoană-terţă', 'idnp');
    }
  }

  if (isset($procedură['debitori'])) {
    foreach ($procedură['debitori'] as $debitor) {
      if (isset($debitor['denumire'])) indexează_după($procedură, $debitor, 'debitor', 'denumire');
      if (isset($debitor['idno'])) indexează_după($procedură, $debitor, 'debitor', 'idno');
      if (isset($debitor['nume'])) indexează_după($procedură, $debitor, 'debitor', 'nume');
      if (isset($debitor['idnp'])) indexează_după($procedură, $debitor, 'debitor', 'idnp');
    }
  }

  function indexează_după($procedură, $date, $secţiune, $cîmp) {
    $dir = "../date/$login/proceduri/index/$cîmp/{$date[$cîmp]}";
    $link = "$dir/$secţiune:{$procedură['număr']}";
    $target = cale($procedură);

    if (!is_dir($dir)) mkdir($dir, $mode, true);
    if (!file_exists($link)) symlink($target, $link);
  }

  function şterge_referinţe_precedente($procedură, $login) {
    // TODO şterge referinţele precedente la procedură
    // index/idno/*/*:număr
    // index/nume/*/*:număr
    // index/idnp/*/*:număr
    // index/denumire/*/*:număr
  }
}
