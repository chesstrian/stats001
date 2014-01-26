<?php

$result = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST)) {
    $file = "./config.inc.php";

    $_POST['name'] = $_POST['name'] == "" ? "asteriskcdrdb" : $_POST['name'];
    $_POST['table'] = $_POST['table'] == "" ? "cdr" : $_POST['table'];

    $data =
'
<?php

$db[\'host\'] = "' . $_POST['host'] . '";
$db[\'user\'] = "' . $_POST['user'] . '";
$db[\'pass\'] = "' . $_POST['pass'] . '";

$db[\'name\'] = "' . $_POST['name'] . '";
$db[\'table\'] = "' . $_POST['table'] . '";

$db[\'port\'] = "' . $_POST['port'] . '";

?>
';

    if (file_put_contents($file, $data) !== false) {
        $result['code'] = 200;
        $result['message'] = "Base de datos configurada correctamente.";
    } else {
        $result['code'] = 204;
        $result['message'] = "Error al configurar la base de datos.";
    }

} else {
    $result['code'] = 403;
    $result['message'] = "Hacking attempt?";
}

echo json_encode($result);

?>
