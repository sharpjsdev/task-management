<?php

class Router
{
    private $routes = [];

    public function add(string $method, string $path, $handler): void
    {
        if (is_string($handler)) {
            $handler = function (...$params) use ($handler) {
                if (!function_exists($handler)) {
                    http_response_code(500);
                    echo json_encode(['message' => "Function '$handler' not found"]);
                    return;
                }
                return call_user_func_array($handler, $params);
            };
        }

        $this->routes[] = compact('method', 'path', 'handler');
    }


    public function dispatch(string $requestUri, string $requestMethod): void
    {
        $path = parse_url($requestUri, PHP_URL_PATH);
         foreach ($this->routes as $route) {
            if ($requestMethod === $route['method'] && preg_match($this->convertToRegex($route['path']), $path, $params)) {
                array_shift($params);
                call_user_func_array($route['handler'], $params);
                return;
            }
        }

        http_response_code(404);
        echo json_encode(['message' => 'Route not found']);
    }

    private function convertToRegex(string $path): string
    {
        $pattern = preg_replace('/\{(\w+)\}/', '(\w+)', $path);
        return "#^$pattern$#";
    }
}
