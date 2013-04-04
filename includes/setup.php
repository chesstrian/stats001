<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST)) {
  $file = "./config.inc.php";

  $_POST['name'] = $_POST['name'] == "" ? "asteriskcdrdb" : $_POST['name'];
  $_POST['table'] = $_POST['table'] == "" ? "cdr" : $_POST['table'];

  $data =
'<?php

$db[\'host\'] = "' . $_POST['host'] . '";
$db[\'user\'] = "' . $_POST['user'] . '";
$db[\'pass\'] = "' . $_POST['pass'] . '";

$db[\'name\'] = "' . $_POST['name'] . '";
$db[\'table\'] = "' . $_POST['table'] . '";

?>
';

  echo file_put_contents($file, $data);
} else {
  echo false;
}

?>
