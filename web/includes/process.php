<?php

if (file_exists('./config.inc.php')) {
  require './config.inc.php';

  $mysqli = new mysqli($db['host'], $db['user'], $db['pass'], $db['name'], $db['port']);

  if ($mysqli->connect_errno) {
    $result = array(
      'status' => array('code' => 500, 'message' => "No es posible la Conexión a la Base de Datos"),
      'data' => array()
    );
    echo json_encode($result);
    exit();
  } else {
    $sql = "SELECT calldate, src, dst, disposition, billsec, ceil ((billsec) / 60) AS minutes
    FROM " . $db['table'] .
    " WHERE calldate BETWEEN '" . $_POST['from'] . " 00:00:00' AND '" . $_POST['to'] . " 23:59:59'
    AND disposition = '". $_POST['disposition'] ."'
    AND (src = '" . $_POST['exten'] . "' OR dst = '" . $_POST['exten'] . "')
    AND (src LIKE '______%' OR dst LIKE '______%')
    ORDER BY calldate ASC";

    if ($query = $mysqli->query($sql, MYSQLI_USE_RESULT)) {
      $data = array();
      while ($row = $query->fetch_object()) {
        array_push($data, $row);
      }
      $result = array(
        'status' => array('code' => 200, 'message' => "Operación Exitosa"),
        'data' => $data
      );
      echo json_encode($result);
      $query->close();
    }
  }

  $mysqli->close();
} else {
  $result = array(
    'status' => array('code' => 412, 'message' => "Base de Datos no Configurada"),
    'data' => array()
  );
  echo json_encode($result);
}

?>
