<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = $_POST;

verifică_login($login);
verifică_număr($procedură);
salvează($procedură);
notează_ca_recentă($procedură['număr']);
reindexează($procedură);


// ==============================

function salvează($procedură) {
  file_put_contents(cale($procedură), json_encode($procedură));
}

// ------------------------------

function reindexează($procedură) {
  $dir = dirname(cale($procedură));
  $fişiere = glob("$dir/*-[0-9]*");

  $index = array();
  $cîmpuri = array('idno', 'denumire', 'idnp', 'nume');

  $collect = function(&$cîmp, $valoare) use (&$index) {
    if (!isset($cîmp) || !$cîmp) return;
    if (!isset($index[$cîmp])) $index[$cîmp] = array();

    $index[$cîmp][] = $valoare;
  };

  foreach ($fişiere as $fişier) {
    $procedură = json_decode(file_get_contents($fişier), true);
    $număr = $procedură['număr'];

    foreach ($cîmpuri as $cîmp) {
      $collect($procedură['creditor'][$cîmp], "C$număr");

      if (isset($procedură['persoane-terţe']))
        foreach ($procedură['persoane-terţe'] as $persoană_terţă)
          $collect($persoană_terţă[$cîmp], "T$număr");

      foreach ($procedură['debitori'] as $debitor)
        $collect($debitor[$cîmp], "D$număr");
    }
  }

  file_put_contents("$dir/index", json_encode($index));
}
