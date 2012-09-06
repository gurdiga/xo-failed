<?

$login = $_SERVER['PHP_AUTH_USER'];
$profil = json_decode(file_get_contents('php://input'), true);

file_put_contents("../date/$login/profil.json", json_encode($profil));
file_put_contents("../date/$login/profil.json.gz", gzencode(json_encode($profil)));
