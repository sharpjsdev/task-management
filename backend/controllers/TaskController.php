<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../auth/jwt.php";

function get_token_from_header()
{
    $headers = [];
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
    }
    // print_r($headers);
    // die;
    if(isset($headers['auth']) || isset($headers['Auth'])){
        if (preg_match('/Bearer\s(\S+)/', $headers['auth'] ?? $headers['Auth'], $matches)) {
            return $matches[1];
        }
    }
    return '';
}

function check_auth()
{
    $token = get_token_from_header();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized: No token provided"]);
        exit();
    }
    $payload = verify_jwt($token);
    if (!$payload) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized: Invalid token"]);
        exit();
    }
}


function getTasks()
{
    check_auth();
    global $pdo;
    $stmt = $pdo->query("SELECT id, title,description, status FROM tasks ORDER BY id DESC");
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        "status" => true,
        "message" => "Get task succesfully",
        "data" => $tasks,
    ]);
}

function createTask()
{   
    check_auth();
    global $pdo;
    try {
        $data = json_decode(file_get_contents("php://input"), true);

        $title = trim($data["title"] ?? "");
        $description = trim($data["description"] ?? "");
        $status = isset($data["status"]) ? (int) $data["status"] : 1;

        if (!$title) {
            http_response_code(400);
            echo json_encode([
                "status" => false,
                "message" => "Title is required",
            ]);
            return;
        }

        $stmt = $pdo->prepare(
            "INSERT INTO tasks (title, description, status) VALUES (:title, :description, :status)"
        );
        $stmt->execute([
            "title" => $title,
            "description" => $description,
            "status" => $status,
        ]);
        $insertedId = $pdo->lastInsertId();

        echo json_encode([
            "status" => true,
            "message" => "Task added successfully",
            "data" => [
                    "id" => $insertedId,
                    "title" => $title,
                    "description" => $description,
                    "status" =>  (string) $status,
                ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "status" => true,
            "message" => "Something went wrong",
            "error" => $e->getMessage(),
        ]);
    }
}

function updateTask()
{
    check_auth();
    global $pdo;

    try {
        $data = json_decode(file_get_contents("php://input"), true);

        $id = $data["id"] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode([
                "status" => false,
                "message" => "Id is required",
            ]);
            return;
        }

        $fields = [];
        $params = ["id" => $id];

        if (isset($data["title"])) {
            $fields[] = "title = :title";
            $params["title"] = trim($data["title"]);
        }

        if (isset($data["description"])) {
            $fields[] = "description = :description";
            $params["description"] = trim($data["description"]);
        }

        if (isset($data["status"])) {
            $fields[] = "status = :status";
            $params["status"] = (int) $data["status"];
        }

        $stmt = $pdo->prepare("UPDATE tasks SET " . implode(", ", $fields) . " WHERE id = :id");
        $stmt->execute($params);

        echo json_encode([
            "status" => true,
            "message" => "Task updated successfully",
            "data" => $params,
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "status" => false,
            "message" => "Something went wrong",
            "error" => $e->getMessage(),
        ]);
    }
}


function deleteTask($id)
{
    check_auth();
    global $pdo;
    try {
        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = :id");
        $stmt->execute(["id" => $id]);
        echo json_encode(["status"=>true ,"message" => "Task deleted"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "status" => false,
            "message" => "Something went wrong",
            "error" => $e->getMessage(),
        ]);
    }
}
