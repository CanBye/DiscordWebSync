<?php

ob_start();
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

function getCacheFile($channel) {
    return '../cache/' . $channel . '_messages.json';
}

function isCacheValid($cacheFile) {
    if (!file_exists($cacheFile)) return false;
    return (time() - filemtime($cacheFile)) < CACHE_DURATION;
}

function fetchDiscordMessages($channelId) {
    $url = API_BASE . '/channels/' . $channelId . '/messages?limit=' . MESSAGE_LIMIT;
    
    $context = stream_context_create([
        'http' => [
            'header' => 'Authorization: Bot ' . BOT_TOKEN . "\r\n",
            'method' => 'GET'
        ]
    ]);
    
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        return false;
    }
    
    return json_decode($response, true);
}

function formatMessage($message) {
    $formatted = [
        'id' => $message['id'],
        'content' => $message['content'],
        'timestamp' => $message['timestamp'],
        'author' => [
            'id' => $message['author']['id'],
            'username' => $message['author']['username'],
            'avatar' => $message['author']['avatar'] ? 
                'https://cdn.discordapp.com/avatars/' . $message['author']['id'] . '/' . $message['author']['avatar'] . '.png' : 
                'https://cdn.discordapp.com/embed/avatars/0.png'
        ],
        'attachments' => []
    ];
    
    if (!empty($message['attachments'])) {
        foreach ($message['attachments'] as $attachment) {
            $formatted['attachments'][] = [
                'url' => $attachment['url'],
                'filename' => $attachment['filename'],
                'content_type' => $attachment['content_type'] ?? 'unknown'
            ];
        }
    }
    
    return $formatted;
}

if (!is_dir('../cache')) {
    mkdir('../cache', 0755, true);
}

$channel = $_GET['channel'] ?? '';

if (!isset($channels[$channel])) {
    ob_clean();
    echo json_encode(['error' => 'Invalid channel']);
    exit;
}

$channelId = $channels[$channel];
$cacheFile = getCacheFile($channel);

if (isCacheValid($cacheFile)) {
    ob_clean();
    echo file_get_contents($cacheFile);
    exit;
}

$messages = fetchDiscordMessages($channelId);

if ($messages === false) {
    ob_clean();
    echo json_encode(['error' => 'Failed to fetch messages']);
    exit;
}

$formattedMessages = [];
foreach ($messages as $message) {
    $formattedMessages[] = formatMessage($message);
}

$result = json_encode($formattedMessages);
file_put_contents($cacheFile, $result);

ob_clean();
echo $result;

?>