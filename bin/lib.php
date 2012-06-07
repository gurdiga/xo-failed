<?

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
  $tip = $procedură['tip'];

  return realpath("../date/$login/proceduri/$tip-$număr");
}

// ------------------------------

function stop($mesaj) {
  error_log($mesaj);
  die();
}
