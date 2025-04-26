<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = 'your-secret-key'; // store securely

function generate_jwt($payload) {
    global $key;
    return JWT::encode($payload, $key, 'HS256');
}

function verify_jwt($token) {
    global $key;
    try {
        return JWT::decode($token, new Key($key, 'HS256'));
    } catch (Exception $e) {
        return null;
    }
}
