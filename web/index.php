<?php

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();
$app['debug'] = true;

$app->register(new Silex\Provider\TwigServiceProvider(), array('twig.path' => __DIR__.'/views',));
$app->register(new Silex\Provider\SessionServiceProvider());
$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
  'db.options' => array(
    'driver'   => 'pdo_mysql',
    'dbname'   => 'stats001',
    'host'     => 'localhost',
    'user'     => 'root',
    'password' => 'un10ckMySQL',
    'charset'  => 'utf8',
    ),
));

use Symfony\Component\HttpFoundation\Response;

$app->get('/', function () use($app) {
  if (null === $user = $app['session']->get('user')) {
    return $app->redirect('login');
  } else {
    return $app->redirect('app');
  }
});

$app->get('/login', function () use ($app) {
  if (null === $user = $app['session']->get('user')) {
    return $app['twig']->render('login.html.twig');
  } else {
    return $app->redirect('app');
  }
});

$app->post('/login', function () use ($app) {
  $username = $app['request']->request->get('username');
  $password = $app['request']->request->get('password');

  $sql = 'SELECT u.id AS userid, u.name AS name, u.username AS username, r.name AS role FROM user AS u INNER JOIN role AS r ON u.role = r.id WHERE username = ? AND password = MD5(?)';
  $result = $app['db']->fetchAssoc($sql, array($username, $password));

  if ($result['userid']) {
    $app['session']->set('user', array('name' => $result['name'], 'username' => $username, 'role' => $result['role']));
    return $app->redirect('app');
  } else {
    return "Error Page. TODO";
  }
});

$app->get('/logout', function () use ($app) {
  if (null === $user = $app['session']->get('user')) {
    return $app->redirect('login');
  } else {
    $app['session']->clear();
    return $app->redirect('login');
  }
});

$app->get('/app', function () use ($app) {
  if (null === $user = $app['session']->get('user')) {
    return $app->redirect('login');
  } else {
    return $app['twig']->render('index.html.twig',array(
      'active'=>'app','location'=>'app','name'=>$app['session']->get('user')['name'],
      'role'=>$app['session']->get('user')['role']
    ));
  }
});

$app->get('/setup', function () use ($app) {
  if (null === $user = $app['session']->get('user')) {
    return $app->redirect('login');
  } else {
    //$rend=['setup.html.twig','active'=>'setup'];
    return $app['twig']->render('setup.html.twig',array(
      'active'=>'setup','location'=>'setup','name'=>$app['session']->get('user')['name'],
      'role'=>$app['session']->get('user')['role']
    ));
  }
});

$app->run();
