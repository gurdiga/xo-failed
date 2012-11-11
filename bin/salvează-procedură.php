<?

require_once './lib.php';


$procedură = json_decode(file_get_contents('php://input'), true);
$cale = "../date/$login/proceduri";

if (!is_dir($cale)) mkdir($cale);
verifică_număr($procedură['număr']);
salvează($procedură);
curăţă_încheierile_salvate($procedură);


// ==============================

function salvează($procedură) {
  if (citeşte_fişier(cale($procedură)) == json_encode($procedură)) {
    header('HTTP/1.1 304 Not Modified');
    return;
  }

  înscrie_fişier(cale($procedură), json_encode($procedură));
  notează_ca_recentă($procedură['număr']);
  reindexează_proceduri();
}

// ------------------------------

function curăţă_încheierile_salvate($procedură) {
  global $login;

  $curente = array();

  array_walk_recursive($procedură, function($value, $key) use (&$curente) {
    if ($key === 'încheiere' || $key === 'anexa') {
      $curente[] = end(split('/', $value)) . '.gz';
    }
  });

  $cale_încheieri = "../date/$login/încheieri";
  $existente = scandir($cale_încheieri);

  array_walk(array_diff($existente, $curente), function($expirată) use ($cale_încheieri) {
    if ($expirată === '.' || $expirată == '..') return;
    unlink("$cale_încheieri/$expirată");
  });
}
