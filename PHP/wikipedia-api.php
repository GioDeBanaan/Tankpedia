<?php
/*
========================================================================
TANKPEDIA – Wikipedia API Proxy (PHP/wikipedia-api.php)
========================================================================
PHP-proxy voor de Wikipedia REST API.
Gebruikt door de PHP-backend (niet door de SPA) om:
  * Zoeken naar tank-pagina's (GET ?q=...)
  * Tank-details ophalen (GET ?details=...) – parseert infobox
  * Samenvattingen ophalen (GET ?summary=...)
Stuurt JSON terug met de opgevraagde gegevens.
Werkt via cURL om CORS- en rate-limiting problemen te omzeilen.
========================================================================
*/
header("Content-Type: application/json; charset=UTF-8");

define('WIKI_REST_BASE', 'https://en.wikipedia.org/api/rest_v1/page/html/');

if (!empty($_GET['details'])) {
  $title = trim($_GET['details']);
  if ($title === '') {
    echo json_encode(['error' => 'Empty title']);
    exit;
  }

  $title = str_replace(' ', '_', $title);
  $url = WIKI_REST_BASE . rawurlencode($title);

  $curl = curl_init($url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
  curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (PHP)');
  curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 10);
  curl_setopt($curl, CURLOPT_TIMEOUT, 20);

  $response = curl_exec($curl);
  $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
  $curlError = curl_error($curl);
  curl_close($curl);

  if ($response === false || $httpCode !== 200) {
    http_response_code($httpCode ?: 500);
    echo json_encode([
      'error' => 'Unable to fetch Wikipedia page HTML',
      'http_code' => $httpCode ?: 500,
      'message' => $curlError ?: 'Unexpected response',
      'url' => $url
    ]);
    exit;
  }

  preg_match_all('/<table[^>]*class="[^"]*infobox[^"]*"[^>]*>.*?<\/table>/is', $response, $allMatches);
  $infoboxes = $allMatches[0];
  
  $bestInfobox = null;
  $bestScore = -1;
  
  foreach ($infoboxes as $candidate) {
    $score = 0;
    if (preg_match('/<th[^>]*>Type<\/th>/i', $candidate)) $score += 3;
    if (preg_match('/<th[^>]*>(?:Model|Variant)<\/th>/i', $candidate)) $score += 2;
    if (preg_match('/<th[^>]*>Crew<\/th>/i', $candidate)) $score += 2;
    if (preg_match('/<th[^>]*>(?:Speed|Armor)<\/th>/i', $candidate)) $score += 2;
    if (preg_match('/<th[^>]*>Armament<\/th>/i', $candidate)) $score += 1;
    if (preg_match('/<th[^>]*>Engine<\/th>/i', $candidate)) $score += 1;
    if (preg_match('/<th[^>]*>Production|Manufactured/i', $candidate)) $score -= 1;
    
    if ($score > $bestScore) {
      $bestScore = $score;
      $bestInfobox = $candidate;
    }
  }
  
  $infobox = $bestInfobox ?: ($infoboxes[0] ?? '');

  $fields = [];
  if ($infobox) {
    if (preg_match('/<img[^>]*src="([^"]+)"/i', $infobox, $imgMatch)) {
      $image = $imgMatch[1];
      if (strpos($image, '//') === 0) {
        $image = 'https:' . $image;
      }
      $fields['image'] = $image;
    }

    preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $infobox, $rowMatches);
    foreach ($rowMatches[1] as $rowHtml) {
      if (preg_match('/<th[^>]*>(.*?)<\/th>/is', $rowHtml, $labelMatch) && preg_match('/<td[^>]*>(.*?)<\/td>/is', $rowHtml, $valueMatch)) {
        $label = trim(strip_tags($labelMatch[1]));
        $value = trim(strip_tags(preg_replace('/<sup[^>]*>.*?<\/sup>/is', '', preg_replace('/<ref[^>]*>.*?<\/ref>/is', '', $valueMatch[1]))));
        $value = html_entity_decode(preg_replace('/\s+/s', ' ', $value), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        
        if (strlen($value) > 200) {
          $firstSentence = preg_split('/[,.;]/', $value);
          $value = trim($firstSentence[0]);
          if (strlen($value) > 150) {
            $value = substr($value, 0, 150) . '...';
          }
        }
        
        if ($label !== '' && $value !== '') {
          $fields[$label] = $value;
        }
      }
    }
  }

  echo json_encode([
    'title' => str_replace('_', ' ', $title),
    'infobox' => $fields,
  ]);
  exit;
}

if (!empty($_GET['summary'])) {
  $title = trim($_GET['summary']);
  if ($title === '') {
    echo json_encode(['error' => 'Empty title']);
    exit;
  }

  $title = str_replace(' ', '_', $title);
  $url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' . rawurlencode($title);
  $curl = curl_init($url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
  curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (PHP)');
  curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 10);
  curl_setopt($curl, CURLOPT_TIMEOUT, 20);

  $response = curl_exec($curl);
  $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
  $curlError = curl_error($curl);
  curl_close($curl);

  if ($response === false || $httpCode !== 200) {
    http_response_code($httpCode ?: 500);
    echo json_encode([
      'error' => 'Unable to fetch Wikipedia page summary',
      'http_code' => $httpCode ?: 500,
      'message' => $curlError ?: 'Unexpected response',
      'url' => $url
    ]);
    exit;
  }

  echo $response;
  exit;
}

$search = $_GET['q'] ?? '';
if (trim($search) === '') {
  echo json_encode(['pages' => []]);
  exit;
}

$url = 'https://en.wikipedia.org/w/rest.php/v1/search/title?q=' . rawurlencode($search) . '&limit=20';

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (PHP)');
curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($curl, CURLOPT_TIMEOUT, 20);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$curlError = curl_error($curl);
curl_close($curl);

if ($response === false || $httpCode !== 200) {
  http_response_code($httpCode ?: 500);
  echo json_encode([
    'error' => 'Unable to query Wikipedia REST API',
    'http_code' => $httpCode ?: 500,
    'message' => $curlError ?: 'Unexpected response',
    'url' => $url
  ]);
  exit;
}

echo $response;