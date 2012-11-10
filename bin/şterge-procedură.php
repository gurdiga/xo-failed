<?

require_once './lib.php';


if (!$_SERVER['SERVER_NAME'] == 'executori.org') stop('Nu ştergem proceduri în producţie');

$login = $_SERVER['PHP_AUTH_USER'];
$file = $_SERVER['REQUEST_URI'];

$matches = array();
preg_match('|/([SP]?-\d+).json$|', $file, $matches);
$număr = $matches[1];

unlink("..$file.gz");
elimină_din_recente($număr);
reindexează_proceduri();
# TODO: şterge încheierile


// ==============================


function elimină_din_recente($număr) {
  global $login;

  $fişier = "../date/$login/proceduri/recente.json";

  if (file_exists("$fişier.gz")) {
    $lista = json_decode(citeşte_fişier($fişier), true);
    $lista = array_filter($lista, function($item) use ($număr) {
      return $item != $număr;
    });

    înscrie_fişier($fişier, json_encode($lista));
  }
}
