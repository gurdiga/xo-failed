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
  $înregistrate = array();

  function unicode_basename($path) {
    return preg_replace('|.*/|', '', $path);
  }

  array_walk_recursive($procedură, function($value, $key) use (&$înregistrate) {
    if (substr($key, 0, 22) === '/formulare-încheieri/') {
      $înregistrate[] = unicode_basename($value) . '.gz';
    }
  });

  $cale_încheieri = "$doc_root/date/$login/proceduri/$număr/încheieri";
  $existente = array_map('unicode_basename', glob("$cale_încheieri/*.html.gz"));
  $expirate = array_diff($existente, $înregistrate);

  array_walk($expirate, function($expirată) use ($cale_încheieri) {
    if ($expirată === '.' || $expirată == '..') return;
    unlink("$cale_încheieri/$expirată");
  });
}

# avem nevoie de "" aici pentru că jQuery aşteaptă JSON în response.body
?>""
