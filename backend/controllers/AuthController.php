<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../auth/jwt.php';

function login()
{
    header('Content-Type: application/json');
    global $pdo;
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['status'=>false,'message' => 'Email and password are required']);
        return;
    }

    $stmt = $pdo->prepare('SELECT id, name, email, password FROM users WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user['password'] !== md5($password)) {
        http_response_code(401);
        echo json_encode(['status'=>false,'message' => 'Invalid email or password']);
        return;
    }

    $token = generate_jwt([
        'id' => $user['id'],
        'email' => $user['email'],
        'exp' => time() + 3600,
    ]);

    setcookie('token', $token, [
        'httponly' => true,
        'secure' => false,
        'samesite' => 'Lax',
        'path' => '/',
    ]);

    echo json_encode([
        'status'=>true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
        ],
        'token' => $token
    ]);
}