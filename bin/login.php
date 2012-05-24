<?

setcookie('login', $_SERVER['PHP_AUTH_USER'], 0, '/');

header("Location: /");
