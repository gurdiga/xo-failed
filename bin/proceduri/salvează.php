<?

$număr = basename(dirname($calea));
$procedură = $conţinut;

if (citeşte_fişier($calea) == $procedură) {
  header('HTTP/1.1 304 Not Modified');
  return;
}

înscrie_fişier($calea, $procedură);
notează_ca_recentă($număr);
reindexează_proceduri();
curăţă_încheierile_salvate($procedură, $număr);


// ==============================

function curăţă_încheierile_salvate($procedură, $număr) {
  global $login, $doc_root;

  $procedură = json_decode($procedură, true);
  $curente = array();

  array_walk_recursive($procedură, function($value, $key) use (&$curente) {
    if ($key === 'încheiere' || $key === 'anexa') {
      $curente[] = basename($value) . '.gz';
    }
  });

  $cale_încheieri = "$doc_root/date/$login/proceduri/$număr/încheieri";
  $existente = glob("$cale_încheieri/*.html");
  $expirate = array_diff($existente, $curente);

  array_walk($expirate, function($expirată) use ($cale_încheieri) {
    if ($expirată === '.' || $expirată == '..') return;
    unlink("$cale_încheieri/$expirată");
  });
}
