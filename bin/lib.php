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

function stop($mesaj) {
  error_log($mesaj);
  die();
}
