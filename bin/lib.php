<?

function verifică_număr($procedură) {
  if (!preg_match('/^[SP]?-\d+$/', $procedură['număr'])) {
    stop("Număr de procedură invalid: [{$procedură['număr']}]");
  }
}

// ------------------------------

function notează_ca_recentă($procedură) {
  define('MAX_RECENTE', 10);

  global $login;

  $target = "../$procedură";
  $link = "../date/$login/proceduri/recente/$procedură";

  if (file_exists($link)) unlink($link);

  symlink($target, $link);

  // elimină pe cele vechi
  $dir = dirname($link);
  $recente = glob("$dir/*");

  usort($recente, function ($a, $b) {
    $data_a = filemtime($a);
    $data_b = filemtime($b);

    if ($data_a == $data_b) return 0;
    else return ($data_a > $data_b) ? -1 : 1;
  });

  $recente_învechite = array_slice($recente, MAX_RECENTE);

  foreach ($recente_învechite as $învechită)
    unlink($învechită);
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
