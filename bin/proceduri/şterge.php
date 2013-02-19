<?

if ($_SERVER['SERVER_NAME'] == 'executori.org') stop('Nu ştergem proceduri în producţie.');

$cale = $doc_root . $_SERVER['REQUEST_URI'];
$număr = basename($cale);

if (!file_exists($cale)) {
  error_log("Nu există procedură de şters: $cale.");
  header('HTTP/1.1 404 Not Found');
  die();
}

rm_rf($cale);
elimină_din_recente($număr);
reindexează_proceduri();


// ==============================

function elimină_din_recente($număr) {
  global $login, $doc_root;

  $fişier = "$doc_root/date/$login/proceduri/recente.json";

  if (!file_exists("$fişier.gz")) return;

  $lista = json_decode(citeşte_fişier($fişier), true);
  $lista = array_filter($lista, function($item) use ($număr) {
    return $item != $număr;
  });
  $lista = array_values($lista);

  înscrie_fişier($fişier, json_encode($lista));
}

// ------------------------------

# inspirat de http://www.php.net/manual/en/function.rmdir.php#108113
function rm_rf($dir) {
  foreach (glob($dir . '/*') as $file) {
    if(is_dir($file)) rm_rf($file);
    else unlink($file);
  }

  rmdir($dir);
}
