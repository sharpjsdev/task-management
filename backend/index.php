<?php
require_once __DIR__ . '/vendor/autoload.php';
// Allow CORS & JSON headers
header("Access-Control-Allow-Origin: *");  
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit;
// }
require_once __DIR__ . '/core/Router.php';

$router = new Router();

require_once __DIR__ . '/routes/api.php';

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

$router->dispatch($uri, $method);
