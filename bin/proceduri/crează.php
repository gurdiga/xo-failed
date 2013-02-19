<?

$procedură = json_decode($conţinut, true);
$număr = următorul_număr();
$director = "$doc_root/date/$login/proceduri/$număr";
$date = "$director/date.json";

if (!file_exists($director)) mkdir($director);

înscrie_fişier($date, $conţinut);
reindexează_proceduri();
notează_ca_recentă($număr);

echo json_encode($date);


// ==============================

function următorul_număr() {
  global $login, $doc_root;

  $proceduri = glob("$doc_root/date/$login/proceduri/*[0-9]*", GLOB_ONLYDIR);
  $numere = array_map(function($file) {
    preg_match('/\d+$/', $file, $matches);

    return (int) $matches[0];
  }, $proceduri);

  if (count($proceduri) > 0) return max($numere) + 1;
  else return 1;
}
