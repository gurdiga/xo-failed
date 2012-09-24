<?

require_once './lib.php';


$login = $_SERVER['PHP_AUTH_USER'];
$profil = json_decode(file_get_contents('php://input'), true);

înscrie_fişier("../date/$login/profil.json", json_encode($profil));
