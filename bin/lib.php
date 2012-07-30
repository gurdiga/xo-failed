<?

function verifică_număr($număr) {
  if (!preg_match('/^[SP]?-\d+$/', $număr)) {
    stop("Număr de procedură invalid: [$număr]");
  }
}

// ------------------------------

function notează_ca_recentă($număr, $afişează = false) {
  define('MAX_RECENTE', 10);

  global $login;

  $fişier = "../date/$login/proceduri/recente";

  if (file_exists($fişier)) {
    $lista = json_decode(file_get_contents($fişier), true);
    $lista = array_filter($lista, function($item) use ($număr) {
      return $item != $număr;
    });
  } else {
    $lista = array();
  }

  array_unshift($lista, $număr);
  array_splice($lista, MAX_RECENTE);

  $json = json_encode($lista);
  file_put_contents($fişier, $json);

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

  return "../date/$login/proceduri/$număr";
}

// ------------------------------

function stop($mesaj) {
  error_log($mesaj);
  die();
}
