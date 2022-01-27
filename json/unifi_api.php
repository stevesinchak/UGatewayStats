<?php
require_once '../vendor/autoload.php';
require_once '../config.php';

// If exists, grab query string to determine what to do
if (!empty($_GET['m']))
{
    $mode = $_GET['m'];
}

if (!empty($mode))
{
    $unifi_connection = new UniFi_API\Client($controller_user, $controller_password, $controller_url, $site_id, $controller_version);
    $set_debug_mode = $unifi_connection->set_debug($debug);
    $login_result = $unifi_connection->login();

    // Ensure login was a success
    if ($login_result==FALSE || $login_result != 200)
    {
        echo '[{"status":"Unable to access or login to UniFi Network Controller"}]';
    }
    else{

        // Need to request additional attributes to get from server that are not included in the default stat_X_gateway() API call
        $extra_attribs = [
            'wan-tx_bytes',
            'wan-rx_bytes',
        ];

        // Call appropriate API based on query string
        switch($mode) {
            case 'minutes':
                $unifi_api_data = $unifi_connection->stat_5minutes_gateway(null, null, $extra_attribs); 
                break;
            case 'hourly':
                $unifi_api_data = $unifi_connection->stat_hourly_gateway(null, null, $extra_attribs);
                break;
            case 'daily':
                $unifi_api_data = $unifi_connection->stat_daily_gateway(null, null, $extra_attribs);
                break;
            case 'monthly':
                $unifi_api_data = $unifi_connection->stat_monthly_gateway(null, null, $extra_attribs);
                break;
        }

        // Return API response as JSON
        header('Content-Type: application/json');
        echo json_encode($unifi_api_data);
    }
}
else
{
    // No query string passed, nothing to do
    echo '[]';
}
?>