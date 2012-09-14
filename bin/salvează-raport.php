<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$conţinut = file_get_contents('php://input');
$fişier = urldecode(basename($_SERVER['REQUEST_URI']));
$cale = "../date/$login/rapoarte";

verifică_nume_fişier($fişier);
if (!is_dir($cale)) mkdir($cale);

file_put_contents("$cale/$fişier", $conţinut);
