<?

require dirname(__FILE__) . '/htusers.php';


if (isset($argv) && count($argv) == 3) {
  if ($argv[1] == 'delete') {
    $login = $argv[2];

    delete_user($login);
  } else {
    $login = $argv[1];
    $password = $argv[2];

    echo "{$argv[1]}:" . encrypt_passsword($argv[2]) . "\n";
  }
}
