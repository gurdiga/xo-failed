<?

$început_execuţie = microtime(true);

require_once './lib.php';


$rute = array(
  'PUT/date/\d+/proceduri/recente\.json' => 'notează-ca-recentă.php',
  'PUT/date/\d+/proceduri/' => 'proceduri/crează.php',
  'PUT/date/\d+/proceduri/[PS]?-\d+/date\.json' => 'proceduri/salvează.php',
  'DELETE/date/\d+/proceduri/[PS]?-\d+/' => 'proceduri/şterge.php',
  'PUT/date/\d+/proceduri/[PS]?-\d+/încheieri/.+\.html' => 'încheieri/salvează.php',
  'PUT/date/\d+/profil\.json' => 'salvează-profil.php'
);

$găsit_script = false;
$pereche = $_SERVER['REQUEST_METHOD'] . urldecode($_SERVER['REQUEST_URI']);

foreach ($rute as $re=>$script) {
  if (preg_match("|^$re$|", $pereche)) {
    $găsit_script = true;

    try {
      require "./$script";
    } catch (Exception $e) {
      stop("500 $pereche: $script\n{$e->getMessage()} {$e->getTraceAsString()}");
    }

    break;
  }
}

if ($găsit_script) {
  $timp_execuţie = timp_execuţie();

  openlog($_SERVER['HTTP_HOST'], LOG_ODELAY, LOG_LOCAL0);
  syslog(LOG_DEBUG, "X-Runtime: $pereche $timp_execuţie");
  closelog();

  header("X-Runtime: $timp_execuţie");
} else {
  error_log("N-avem script pentru $pereche.");
  header('HTTP/1.1 404 Not Found');
}