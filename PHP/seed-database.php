<?php
/*
========================================================================
TANKPEDIA – Database Seeder (PHP/seed-database.php)
========================================================================
Vult de MySQL-database met tankgegevens via de Wikipedia REST API.
Doorloopt een lijst van tanks per land, haalt voor elk een beschrijving
en thumbnail op van Wikipedia, en slaat deze op in de `tanks`-tabel.
Te gebruiken via CLI of browser:
  php seed-database.php  of  open in browser (via localhost)
Vooraf: maak een MySQL-database `tankpedia` aan met een `tanks`-tabel.
========================================================================
*/
$host = '127.0.0.1';
$dbname = 'tankpedia';
$user = 'root';
$pass = '';
$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

header("Content-Type: text/plain; charset=UTF-8");

echo "=== Tankpedia Database Seeder ===\n";
echo "Seeding comprehensive military tank database...\n\n";

$pdo->exec("TRUNCATE TABLE tanks");
echo "[OK] Cleared existing data\n\n";

$tanksByCountry = [
  'American' => [
    'M1 Abrams', 'M4 Sherman', 'M4 Sherman variants',
    'M26 Pershing', 'M46 Patton', 'M47 Patton', 'M48 Patton',
    'M60 tank', 'M103 heavy tank', 'M41 Walker Bulldog',
    'M24 Chaffee', 'M3 Stuart', 'M2 light tank', 'M22 Locust',
    'M3 Lee', 'M2 medium tank', 'M6 heavy tank',
    'T29 heavy tank', 'T30 heavy tank', 'T34 heavy tank',
    'T92 light tank', 'M551 Sheridan', 'M50 Ontos',
    'M10 tank destroyer', 'M18 Hellcat', 'M36 tank destroyer',
    'M56 Scorpion', 'T28 super-heavy tank', 'T95 medium tank',
    'M7 medium tank', 'T20 medium tank', 'T14 heavy tank',
  ],
  'Soviet' => [
    'T-34', 'T-34 variants', 'T-44',
    'T-54/T-55', 'T-62', 'T-64',
    'T-72', 'T-80', 'T-90', 'T-14 Armata',
    'T-10 tank', 'T-35', 'T-28', 'T-26',
    'T-37A tank', 'T-38 tank', 'T-40 tank', 'T-50 tank',
    'T-60 tank', 'T-70 tank',
    'BT tank', 'BT-2', 'BT-5', 'BT-7',
    'IS-2', 'IS-3', 'IS-4', 'IS-7',
    'KV-1', 'KV-2', 'KV-13', 'KV-85', 'KV-220',
    'SU-76', 'SU-85', 'SU-100', 'SU-122', 'SU-152',
    'ISU-122', 'ISU-152',
    'T-100 tank', 'SMK tank', 'T-27', 'T-17 tank',
    'T-18 tank', 'T-24 tank',
    'PT-76', 'BMD-1',
    'Object 279', 'Object 292', 'Object 416', 'Object 430',
    'Object 775',
  ],
  'German' => [
    'Leopard 1', 'Leopard 2', 'Leopard 2E',
    'Panther tank', 'Panther II tank', 'Tiger I', 'Tiger II',
    'Panzer I', 'Panzer II', 'Panzer III', 'Panzer IV',
    'Panzer VIII Maus',
    'Sturmgeschütz III', 'Sturmgeschütz IV',
    'Jagdpanzer IV', 'Jagdpanther', 'Jagdtiger',
    'Sturmpanzer IV', 'Sturmtiger',
    'Kampfpanzer 70', 'MBT-70', 'VK 16.02 Leopard',
    'VK 30.01 (H)', 'VK 45.01 (P)', 'VK 45.02 (P)',
    'Neubaufahrzeug', 'Leichttraktor', 'Grosstraktor',
  ],
  'British' => [
    'Centurion (tank)', 'Challenger 1', 'Challenger 2',
    'Chieftain (tank)', 'Conqueror (tank)', 'Cromwell tank',
    'Crusader tank', 'Churchill tank', 'Matilda II',
    'Valentine tank', 'Matilda I (tank)',
    'Vickers MBT',
    'Vickers Medium Mark I', 'Vickers Medium Mark II',
    'Comet (tank)', 'A22 tank',
    'Mark V tank', 'Mark VIII tank', 'Mark IV tank',
    'Mark I tank', 'Medium Mark A Whippet', 'Medium Mark C',
    'Tank Mark VIII',
    'Tortoise heavy assault tank', 'TOG 2',
    'Excelsior tank', 'Valiant tank', 'Black Prince (tank)',
    'Archer (tank destroyer)',
    'British heavy tanks of the First World War',
    'Little Willie', 'Covenanter tank', 'Cavalier tank',
    'Tetrarch (tank)', 'Harry Hopkins (tank)',
    'Cruiser Mk I', 'Cruiser Mk II', 'Cruiser Mk III',
    'Cruiser Mk IV', 'Cruiser Mk V',
    'Ram tank', 'Sentinel tank',
  ],
  'French' => [
    'AMX-13', 'AMX-30', 'AMX-40', 'AMX-50',
    'Leclerc (tank)', 'Renault FT', 'Char B1', 'Char 2C',
    'Schneider CA1', 'Saint-Chamond (tank)',
    'SOMUA S35', 'AMC 35', 'AMR 33', 'AMR 35',
    'Hotchkiss H35', 'Hotchkiss H39',
    'Renault R35', 'Renault R40',
    'FCM 36', 'Char D1', 'Char D2', 'ARL 44',
    'AMX-38',
  ],
  'Japanese' => [
    'Type 90 tank', 'Type 10', 'Type 74', 'Type 61',
    'Type 97 Chi-Ha', 'Type 95 Ha-Go', 'Type 89 I-Go',
    'Type 2 Ka-Mi', 'Type 3 Chi-Nu', 'Type 4 Chi-To',
    'Type 5 Chi-Ri', 'Type 97 Te-Ke tankette',
    'Type 94 tankette', 'Type 97 Chi-Ni',
    'Type 1 Chi-He', 'Type 98 Ke-Ni', 'Type 2 Ke-To',
    'Type 16 maneuver combat vehicle',
  ],
  'Israeli' => [
    'Merkava', 'Merkava II', 'Merkava III', 'Merkava IV',
    'Magach', 'Sho\'t', 'Sabra (tank)',
    'Tiran',
  ],
  'Italian' => [
    'Ariete', 'M13/40', 'M14/41', 'M15/42',
    'Fiat 2000', 'Fiat 3000', 'L3/33', 'L3/35',
    'L6/40', 'P 26/40',
    'Semovente 75/18', 'Semovente 75/34', 'Semovente 105/25',
    'OF-40',
  ],
  'Chinese' => [
    'Type 59 tank', 'Type 62 tank', 'Type 63 (tank)', 'Type 69 tank',
    'Type 79 tank', 'Type 80/88 main battle tank',
    'Type 85 tank', 'Type 96 tank', 'Type 99 tank',
    'Type 15 tank', 'VT-4', 'VT-5',
    'WZ-111 heavy tank',
  ],
  'South Korean' => [
    'K1 tank', 'K2 Black Panther',
  ],
  'Swedish' => [
    'Stridsvagn 103', 'Stridsvagn 74', 'Stridsvagn 81',
    'Stridsvagn 101', 'Stridsvagn 102', 'Stridsvagn 104',
    'Stridsvagn 121', 'Stridsvagn 122',
    'Stridsvagn m/21', 'Stridsvagn m/37', 'Stridsvagn m/38',
    'Stridsvagn m/39', 'Stridsvagn m/40', 'Stridsvagn m/42',
    'Stridsvagn L-60', 'Landsverk L-5', 'Landsverk L-10',
    'LK II', 'Strv fm/28',
  ],
  'Polish' => [
    'PT-91 Twardy', '7TP', '10TP',
    'TK (tankette)', 'TKS', 'TKD (tank destroyer)',
  ],
  'Czech' => [
    'LT vz. 34', 'Panzer 35(t)', 'Panzer 38(t)',
    'Škoda Š-I-j', 'Škoda MU-4',
    'Tančík vz. 33', 'Kolohousenka',
  ],
  'Turkish' => [
    'Altay (tank)', 'Kaplan MT / Harimau',
    'M60T tank',
  ],
  'Canadian' => [
    'Ram tank', 'Grizzly (tank)',
    'Skink anti-aircraft tank',
  ],
  'Australian' => [
    'Sentinel tank',
  ],
  'Indian' => [
    'Arjun (tank)', 'Vijayanta',
  ],
  'Iranian' => [
    'Zulfiqar (tank)', 'Type 72Z',
  ],
  'North Korean' => [
    'Ch\'ŏnma-ho', 'Pokpung-ho',
    'M-1985 (tank)',
  ],
  'Romanian' => [
    'TR-85', 'TR-77', 'TR-125',
    '1942 medium tank (Romania)',
    'R-1 tank', 'R-2 tank',
  ],
  'Yugoslav' => [
    'M-84', 'M-95 Degman',
  ],
  'Hungarian' => [
    '38M Toldi', '40M Turán', '44M Tas',
    'Toldi (tank)', 'Turán (tank)',
  ],
  'Spanish' => [
    'Verdeja (tank)', 'AMX-30E', 'Leopard 2E',
  ],
  'Brazilian' => [
    'Osório (tank)', 'X1A (tank)',
  ],
  'Swiss' => [
    'Panzer 61', 'Panzer 68',
  ],
  'Austrian' => [
    'SK-105 Kürassier',
  ],
  'Argentine' => [
    'TAM (tank)', 'Nahuel DL-43',
  ],
  'South African' => [
    'Olifant (tank)', 'Rooikat',
  ],
];

$totalTanks = 0;
foreach ($tanksByCountry as $country => $tanks) {
  $totalTanks += count($tanks);
}
echo "Total tank entries in list: $totalTanks\n\n";

$allEntries = [];
foreach ($tanksByCountry as $country => $tanks) {
  foreach ($tanks as $title) {
    $key = str_replace(' ', '_', $title);
    $allEntries[$key] = ['title' => $title, 'country' => $country];
  }
}

echo "Fetching descriptions and thumbnails...\n\n";

$inserted = 0;
$skipped = 0;
$i = 0;
$total = count($allEntries);

foreach ($allEntries as $pageKey => $entry) {
  $i++;
  $title = $entry['title'];
  $country = $entry['country'];

  echo "[$i/$total] $title... ";

  $url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' . rawurlencode($pageKey);

  $attempts = 0;
  $summaryData = null;
  $maxAttempts = 5;

  while ($attempts < $maxAttempts) {
    $attempts++;
    if ($attempts > 1) {
      $wait = $attempts * 3;
      echo "R";
      sleep($wait);
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'TankpediaSeeder/3.0');
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 429) {
      continue;
    }

    if ($response && $httpCode === 200) {
      $summaryData = json_decode($response, true);
    } else {
      echo "[HTTP $httpCode]";
    }
    break;
  }

  if (!$summaryData) {
    echo "[FAILED]\n";
    $skipped++;
    sleep(1);
    continue;
  }

  if (!empty($summaryData['type']) && $summaryData['type'] === 'disambiguation') {
    echo "[DISAMBIG]\n";
    $skipped++;
    sleep(1);
    continue;
  }

  $description = $summaryData['description'] ?? '';

  $thumbnailUrl = null;
  if (!empty($summaryData['thumbnail']['source'])) {
    $thumbnailUrl = $summaryData['thumbnail']['source'];
  }

  $stmt = $pdo->prepare("INSERT INTO tanks (title, page_key, description, thumbnail_url, country) VALUES (?, ?, ?, ?, ?)");
  $stmt->execute([$title, $pageKey, $description, $thumbnailUrl, $country]);

  if ($stmt->rowCount() > 0) {
    $inserted++;
    echo "[OK] [$country]\n";
  } else {
    echo "[DUP]\n";
    $skipped++;
  }

  usleep(500000);
}

echo "\n========================================\n";
echo "Done! Inserted: $inserted tanks\n";
echo "Skipped/failed: $skipped\n";
$finalCount = $pdo->query("SELECT COUNT(*) FROM tanks")->fetchColumn();
echo "Total in database: $finalCount\n";
echo "========================================\n";
