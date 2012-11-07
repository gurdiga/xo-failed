<?

$start = microtime(true);
$handlers = array(
  '/date/\d+/proceduri/index\.json' => 'citeşte.php',
  '/date/\d+/proceduri/recente\.json' => 'notează-ca-recentă.php',
  '/date/\d+/proceduri/[PS]?-\d+\.json' => 'proceduri.php',
  '/date/\d+/profil\.json' => 'salvează-profil.php',
  '/date/\d+/încheieri/.+\.html' => 'salvează-încheiere.php'
);

$path = urldecode($_SERVER['REQUEST_URI']);
$găsit_handler = false;

foreach ($handlers as $re=>$handler) {
  if (preg_match("|^$re$|", $path)) {
    require "./$handler";
    $găsit_handler = true;
    break;
  }
}

if (!$găsit_handler) error_log("No handler for [$path]");

$runtime = microtime(true) - $start;
header("X-Runtime: $runtime");
