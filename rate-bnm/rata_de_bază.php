<?

ini_set('display_errors', 1);

ob_start();
readgzfile('http://bnm.md/');
$html = ob_get_contents();
ob_end_clean();

$start_valoare = strpos($html, '<td class="type_number">', strpos($html, 'Rata de baz'));
$sfîrşit_valoare = strpos($html, '%', $start_valoare);
$valoarea = substr($html, $start_valoare + 24, $sfîrşit_valoare - $start_valoare - 25);

$start_dată = strpos($html, '<td class="type_date">', $sfîrşit_valoare);
$sfîrşit_dată = strpos($html, '</td>', $start_dată);
$data = substr($html, $start_dată + 22, $sfîrşit_dată - $start_dată - 22);
$data = date_parse_from_format('d.m.Y', $data);
$data = date('Y-m-d', mktime(0, 0, 0, $data['month'], $data['day'], $data['year']));

$root = dirname(__FILE__);
$json = "$root/rata_de_bază.json";

$rate = json_decode(file_get_contents($json), true);
$rate[$data] = $valoarea;

file_put_contents($json, json_encode($rate));
