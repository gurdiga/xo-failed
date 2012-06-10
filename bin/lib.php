<?

function verifică_număr($procedură) {
  if (!preg_match('/^[SP]?-\d+$/', $procedură['număr'])) {
    stop("Număr de procedură invalid: [{$procedură['număr']}]");
  }
}

// ------------------------------

function notează_ca_recentă($procedură) {
  global $login;

  $target = "../$procedură";
  $link = "../date/$login/proceduri/recente/$procedură";

  if (file_exists($link)) unlink($link);

  symlink($target, $link);

  // TODO: elimină pe cele vechi
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
