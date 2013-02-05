<?

if (isset($_SERVER['PHP_AUTH_USER'])) $login = $_SERVER['PHP_AUTH_USER'];
$doc_root = $_SERVER['DOCUMENT_ROOT'];
$calea = $doc_root . urldecode($_SERVER['REQUEST_URI']);
$conţinut = file_get_contents('php://input');
$development = substr($_SERVER['SERVER_NAME'], 0, 4) == 'dev.';

if (!$development) {
  set_error_handler(function($no, $message, $file, $line) {
    stop("Error $no: $message @$file:$line " . $_SERVER['SERVER_NAME']);
  });
}

// ------------------------------

function verifică_număr($număr) {
  if (!preg_match('/^[SP]?-\d+$/', $număr)) {
    stop("Număr de procedură invalid: [$număr]");
  }
}

// ------------------------------

function notează_ca_recentă($număr, $afişează = false) {
  define('MAX_RECENTE', 10);

  global $login, $doc_root;

  $număr = json_decode($număr, true);
  $fişier = "$doc_root/date/$login/proceduri/recente.json";

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

  if ($afişează) echo $json;
}

// ------------------------------

function cale($procedură) {
  global $login, $doc_root;

  $număr = $procedură['număr'];

  return "$doc_root/date/$login/proceduri/$număr.json";
}

// ------------------------------

function timp_execuţie() {
  global $început_execuţie;

  return round(microtime(true) - $început_execuţie, 3);
}

// ------------------------------

function stop($mesaj) {
  header('HTTP/1.1 500 Application Error');
  header('X-Runtime: ' . timp_execuţie());
  error_log($mesaj);
  error_log('X-Runtime: ' . timp_execuţie());

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
  global $login, $doc_root;

  $dir = "$doc_root/date/$login/proceduri";
  $fişiere = glob("$dir/*[1-9]*/date.json.gz");

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

  function colectează(&$cîmp, $număr, &$index) {
    if (!isset($cîmp) || !$cîmp) return;

    if (!isset($index[$cîmp])) $index[$cîmp] = array();
    $index[$cîmp][] = $număr;
  };

  foreach ($fişiere as $fişier) {
    $procedură = json_decode(citeşte_fişier(str_replace('.gz', '', $fişier)), true);
    $număr = $login . basename(dirname($fişier));
    $index[''][$număr] = array(
      'data-hotărîrii' => $procedură['document-executoriu']['data-hotărîrii'],
      'creditor' => persoană($procedură['creditor']),
      'persoane-terţe' => array_map('persoană', $procedură['persoane-terţe']),
      'debitori' => array_map('persoană', $procedură['debitori'])
    );

    foreach ($cîmpuri as $cîmp) {
      colectează($număr, $număr, $index);
      colectează($procedură['creditor'][$cîmp], $număr, $index);

      foreach ($procedură['persoane-terţe'] as $persoană_terţă)
        colectează($persoană_terţă[$cîmp], $număr, $index);

      foreach ($procedură['debitori'] as $debitor)
        colectează($debitor[$cîmp], $număr, $index);
    }
  }

  foreach ($index as $cîmp=>$numere) {
    if ($cîmp == "") continue;
    $index[$cîmp] = array_unique($numere);
  }

  înscrie_fişier("$dir/index.json", json_encode($index));
}

// ------------------------------

function verifică_dacă_există($procedură) {
  global $login, $doc_root;

  $cale = "$doc_root/date/$login/proceduri/$procedură.json.gz";

  if (!file_exists($cale)) {
    stop("Nu există procedura: [$cale]");
  }
}
