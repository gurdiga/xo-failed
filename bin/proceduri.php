<?

$handler = array(
  'POST' => './salvează-procedură.php',
  'DELETE' => './şterge-procedură.php'
);

require $handler[$_SERVER['REQUEST_METHOD']];
