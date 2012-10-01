<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$conţinut = file_get_contents('php://input');
$fişier = urldecode(basename($_SERVER['REQUEST_URI']));
$cale = "../date/$login/încheieri";

verifică_nume_fişier($fişier);
înscrie_fişier("$cale/$fişier", $conţinut);
