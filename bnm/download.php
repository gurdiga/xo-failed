<?

$root = $argv[1];

ini_set('display_errors', 1);
date_default_timezone_set('Europe/Chisinau');
openlog('executori.org', LOG_ODELAY, LOG_LOCAL0);
syslog(LOG_DEBUG, 'Start ' . __FILE__);

$data = date('d.m.Y');
$url = "http://bnm.md/md/official_exchange_rates?get_xml=1&date=$data";

chdir($root);
$dir = date('Y/m/');
$js = $dir . date('d') . '.js';

if (!is_dir($dir)) mkdir($dir, 0755, true);

$xml = file_get_contents($url);
syslog(LOG_DEBUG, 'Descărcat ' . strlen($xml) . ' bytes');

$array = array();
$simple_xml = simplexml_load_string($xml);

foreach ($simple_xml->Valute as $valuta) {
  $array[(string) $valuta->CharCode[0]] = array(
    'nominal' => (int) $valuta->Nominal[0],
    'value' => (float) $valuta->Value[0]
  );
};

file_put_contents($js, 'var RateBNM = ' . json_encode($array) . ';');
syslog(LOG_DEBUG, "Înregistrat JS: $js " . filesize($js) . " bytes");

if (file_exists('current.js')) unlink('current.js');
symlink($js, 'current.js');
