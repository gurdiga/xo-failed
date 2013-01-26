<?

$root = dirname(__FILE__);

ini_set('display_errors', 1);
ini_set('error_log', "$root/" . basename(__FILE__, '.php') . '.log');
date_default_timezone_set('Europe/Chisinau');
error_log('Start');

ob_start();
readgzfile('http://bnm.md/');
$html = ob_get_contents();
ob_end_clean();
error_log('Descărcat ' . strlen($html) . ' bytes');

$start_valoare = strpos($html, '<td class="type_number">', strpos($html, 'Rata de baz'));
$sfîrşit_valoare = strpos($html, '%', $start_valoare);
$valoarea = floatval(substr($html, $start_valoare + 24, $sfîrşit_valoare - $start_valoare - 25));
error_log("Valoarea: $valoarea");

$start_dată = strpos($html, '<td class="type_date">', $sfîrşit_valoare);
$sfîrşit_dată = strpos($html, '</td>', $start_dată);
$data = substr($html, $start_dată + 22, $sfîrşit_dată - $start_dată - 22);
$data = date_parse_from_format('d.m.Y', $data);
$data = date('Y-m-d', mktime(0, 0, 0, $data['month'], $data['day'], $data['year']));
error_log("Data: $data");

chdir("$root/../date/bnm");
$json = "rata_de_bază.json";
$rate = json_decode(file_get_contents($json), true);
$rate[$data] = $valoarea;
file_put_contents($json, json_encode($rate));
error_log('Înregistrat JSON: ' . filesize($json) . ' bytes');

$js = "rata_de_bază.js";
file_put_contents($js, 'var RateDeBază = ' . json_encode($rate) . ';');
error_log('Înregistrat JS: ' . filesize($js) . ' bytes');
