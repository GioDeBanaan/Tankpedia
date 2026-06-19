<?php
$host = '127.0.0.1';
$dbname = 'tankpedia';
$user = 'root';
$pass = '';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}

header("Content-Type: application/json; charset=UTF-8");

$q = trim($_GET['q'] ?? '');

if ($q === '') {
  echo json_encode(['pages' => []]);
  exit;
}

$anywhere = '%' . $q . '%';
$exactStart = $q . '%';

$stmt = $pdo->prepare("
  SELECT title, page_key, description, thumbnail_url, country
  FROM tanks
  WHERE title LIKE ? OR description LIKE ?
  ORDER BY
    CASE WHEN title LIKE ? THEN 0 ELSE 1 END,
    CASE WHEN title LIKE ? THEN 0 ELSE 1 END,
    title ASC
  LIMIT 30
");
$stmt->execute([$anywhere, $anywhere, $exactStart, $anywhere]);
$results = $stmt->fetchAll();

$pages = [];
foreach ($results as $row) {
  $page = [
    'title' => $row['title'],
    'key' => $row['page_key'],
    'description' => $row['description'],
    'country' => $row['country'],
  ];
  if ($row['thumbnail_url']) {
    $page['thumbnail'] = ['url' => $row['thumbnail_url']];
  }
  $pages[] = $page;
}

echo json_encode(['pages' => $pages]);
