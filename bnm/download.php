<?

$root = dirname(__FILE__);

ini_set('display_errors', 1);
ini_set('error_log', "$root/" . basename(__FILE__, '.php') . '.log');
date_default_timezone_set('Europe/Chisinau');
error_log('Start');

$data = date('d.m.Y');
$url = "http://bnm.md/md/official_exchange_rates?get_xml=1&date=$data";

$dir = "$root/../date/bnm/" . date('Y/m/');
$js = $dir . date('d') . '.js';

if (file_exists($js)) exit;

if (!is_dir($dir)) mkdir($dir, 0755, true);

$xml = file_get_contents($url);
error_log('Descărcat ' . strlen($xml) . ' bytes');

$array = array();
$simple_xml = simplexml_load_string($xml);

foreach ($simple_xml->Valute as $valuta) {
  $array[(string) $valuta->CharCode[0]] = array(
    'nominal' => (int) $valuta->Nominal[0],
    'value' => (float) $valuta->Value[0]
  );
};

file_put_contents($js, 'var RateBNM = ' . json_encode($array) . ';');
error_log("Înregistrat JS: $js " . filesize($js) . " bytes");

$current = "$root/../date/bnm/current.js";
unlink($current);
symlink($js, $current);
