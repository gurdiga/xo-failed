<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = json_decode(file_get_contents("php://input"), true);

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
  global $login;

  $dir = dirname(cale($procedură));
  $fişiere = glob("$dir/*-[0-9]*");

  $index = array();
  $cîmpuri = array('idno', 'denumire', 'idnp', 'nume');

  function persoană($persoană) {
    return $persoană['gen-persoană'] == 'fizică' ?
      array(
        'nume' => $persoană['nume'],
        'idnp' => $persoană['idnp']
      )
      :
      array(
        'denumire' => $persoană['denumire'],
        'idno' => $persoană['idno']
      );
  }

  $colectează = function(&$cîmp, $procedură) use (&$index, $login) {
    if (!isset($cîmp) || !$cîmp) return;

    $creditor = persoană($procedură['creditor']);
    $persoane_terţe = array();

    if (isset($procedură['persoane-terţe']))
      foreach ($procedură['persoane-terţe'] as $persoană_terţă)
        $persoane_terţe[] = persoană($persoană_terţă);

    $debitori = array();

    foreach ($procedură['debitori'] as $debitor)
      $debitori[] = persoană($debitor);

    $număr = $login . $procedură['număr'];
    $index[$cîmp][$număr] = array(
      'data-hotărîrii' => $procedură['document-executoriu']['data-hotărîrii'],
      'creditor' => $creditor,
      'persoane-terţe' => $persoane_terţe,
      'debitori' => $debitori
    );
  };

  foreach ($fişiere as $fişier) {
    $procedură = json_decode(file_get_contents($fişier), true);
    $număr = $login . $procedură['număr'];

    foreach ($cîmpuri as $cîmp) {
      $colectează($număr, $procedură);
      $colectează($procedură['creditor'][$cîmp], $procedură);

      if (isset($procedură['persoane-terţe']))
        foreach ($procedură['persoane-terţe'] as $persoană_terţă)
          $colectează($persoană_terţă[$cîmp], $procedură);

      foreach ($procedură['debitori'] as $debitor)
        $colectează($debitor[$cîmp], $procedură);
    }
  }

  file_put_contents("$dir/index", json_encode($index));
}
