<?

function verifică_număr($număr) {
  if (!preg_match('/^[SP]?-\d+$/', $număr)) {
    stop("Număr de procedură invalid: [$număr]");
  }
}

// ------------------------------

function verifică_nume_fişier($nume) {
  if (preg_match('/\.\./', $nume)) {
    stop("Nume de fişier invalid: [$nume]");
  }
}

// ------------------------------

function notează_ca_recentă($număr, $afişează = false) {
  define('MAX_RECENTE', 10);

  global $login;

  $fişier = "../date/$login/proceduri/recente.json";

  if (file_exists("$fişier.gz")) {
    $lista = json_decode(citeşte_fişier($fişier), true);
    $lista = array_filter($lista, function($item) use ($număr) {
      return $item != $număr;
    });
  } else {
    $lista = array();
  }

  array_unshift($lista, $număr);
  array_splice($lista, MAX_RECENTE);

  $json = json_encode($lista);
  înscrie_fişier($fişier, $json);

  if ($afişează) {
    header('Content-Type: application/json');
    echo $json;
  }
}

// ------------------------------

function verifică_login($login) {
  if (!preg_match('/^\d+$/', $login)) {
    stop("Login invalid: [$login]");
  }

  if (!is_dir("../date/$login")) {
    stop("Nu există director pentru date: [$login]");
  }
}

// ------------------------------

function cale($procedură) {
  global $login;

  $număr = $procedură['număr'];

  return "../date/$login/proceduri/$număr.json";
}

// ------------------------------

function stop($mesaj) {
  error_log($mesaj);
  die();
}

// ------------------------------

function înscrie_fişier($cale, $conţinut) {
  file_put_contents("$cale.gz", gzencode($conţinut));
}

// ------------------------------

function citeşte_fişier($cale) {
  ob_start();
  readgzfile("$cale.gz");
  $content = ob_get_contents();
  ob_end_clean();

  return $content;
}

// ------------------------------

function reindexează_proceduri() {
  global $login;

  $dir = "../date/$login/proceduri";
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

function verifică_dacă_există($procedură) {
  global $login;

  $cale = "../date/$login/proceduri/$procedură.json.gz";

  if (!file_exists($cale)) {
    stop("Nu există procedura: [$cale]");
  }
}
