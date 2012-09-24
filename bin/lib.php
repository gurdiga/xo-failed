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
