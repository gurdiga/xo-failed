<?

ini_set('display_errors', 1);

$data = date('d.m.Y');
$url = "http://bnm.md/md/official_exchange_rates?get_xml=1&date=$data";

$root = dirname(__FILE__);
$dir = "$root/" . date('Y/m/');
$xml_file = $dir . date('d') . '.xml';
$json_file = $dir . date('d') . '.json';

if (file_exists($xml_file)) exit;

if (!is_dir($dir)) mkdir($dir, 0755, true);

$xml = file_get_contents($url);
file_put_contents($xml_file, $xml);
#$xml = file_get_contents($xml_file);


$array = array();
$simple_xml = simplexml_load_string($xml);

foreach ($simple_xml->Valute as $valuta) {
  $array[(string) $valuta->CharCode[0]] = array(
    'nominal' => (int) $valuta->Nominal[0],
    'value' => (float) $valuta->Value[0]
  );
};

file_put_contents($json_file, json_encode($array));
symlink($json_file , "$root/current.json");
