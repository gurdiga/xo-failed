<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$procedură = json_decode(file_get_contents('php://input'), true);
$cale = "../date/$login/proceduri";

verifică_login($login);
if (!is_dir($cale)) mkdir($cale);
verifică_număr($procedură['număr']);
salvează($procedură);
curăţă_încheierile_salvate($procedură);


// ==============================

function salvează($procedură) {
  if (citeşte_fişier(cale($procedură)) == json_encode($procedură)) {
    header('HTTP/1.1 304 Not Modified');
    return;
  }

  înscrie_fişier(cale($procedură), json_encode($procedură));
  notează_ca_recentă($procedură['număr']);
  reindexează($procedură);
}

// ------------------------------

function reindexează($procedură) {
  global $login;

  $dir = dirname(cale($procedură));
  $fişiere = glob("$dir/*-[0-9]*");

  $index = array('' => array());
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

    $număr = $login . $procedură['număr'];

    if (!isset($index[$cîmp])) $index[$cîmp] = array();
    if (!in_array($număr, $index[$cîmp])) $index[$cîmp][] = $număr;
  };

  function opţional(&$valoare) {
    if (isset($valoare)) return $valoare;
    else return '';
  }

  function date_relevante($procedură) {
    $persoane_terţe = array();

    if (isset($procedură['persoane-terţe']))
      foreach ($procedură['persoane-terţe'] as $persoană_terţă)
        $persoane_terţe[] = persoană($persoană_terţă);

    $debitori = array();

    foreach ($procedură['debitori'] as $debitor)
      $debitori[] = persoană($debitor);

    $date = array(
      'data-hotărîrii' => opţional($procedură['document-executoriu']['data-hotărîrii']),
      'creditor' => persoană($procedură['creditor']),
      'persoane-terţe' => $persoane_terţe,
      'debitori' => $debitori
    );

    return $date;
  }

  foreach ($fişiere as $fişier) {
    $procedură = json_decode(citeşte_fişier(str_replace('.gz', '', $fişier)), true);
    $număr = $login . $procedură['număr'];
    $index[''][$număr] = date_relevante($procedură);

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

  înscrie_fişier("$dir/index.json", json_encode($index));
}

// ------------------------------

function curăţă_încheierile_salvate($procedură) {
  global $login;

  $curente = array();

  array_walk_recursive($procedură, function($value, $key) use (&$curente) {
    if ($key === 'încheiere' || $key === 'anexa') {
      $curente[] = end(split('/', $value)) . '.gz';
    }
  });

  $cale_rapoarte = "../date/$login/rapoarte";
  $existente = scandir($cale_rapoarte);

  array_walk(array_diff($existente, $curente), function($expirată) use ($cale_rapoarte) {
    if ($expirată === '.' || $expirată == '..') return;
    unlink("$cale_rapoarte/$expirată");
  });
}
