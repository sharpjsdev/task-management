<?php

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/TaskController.php';

$router->add('POST', '/api/login', 'login');
$router->add('GET', '/api/tasks', 'getTasks');
$router->add('POST', '/api/tasks', 'createTask');
$router->add('PUT', '/api/tasks', 'updateTask');
$router->add('DELETE', '/api/tasks/{id}', 'deleteTask');
