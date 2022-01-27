## UGatewayStats
A simple graphical interface to display UniFi Gateway WAN bandwidth statistics pulled from the UniFi Controller with direct API calls. Written in PHP and JavaScript, this tool is powered by [Bootstrap](https://getbootstrap.com/), [Bootstrap-Table](https://bootstrap-table.com/), [Chart.js](https://www.chartjs.org/), [jQuery](https://jquery.com/), [Composer](https://getcomposer.org/), and most importantly, the [UniFi API Client](https://github.com/Art-of-WiFi/UniFi-API-client).

### Features

The following reports are provided for tracking WAN upload and download data usage in both chart and table form:

- 5 Minute Bandwidth: 12 hours of data organized in 5 minute intervals. 
- Hourly Bandwidth: 7 days of data organized per hour. 
- Daily Bandwidth: 12 months, or max data available, organized per day. 
- Monthly Bandwidth: 12 months, or max data available, organized per month. 

### Requirements

- Web server that support PHP 5.5.0 or newer, and the PHP-JSON and PHP-CURL modules installed. 
- UniFi Controller version 5.5 or newer.
- Network access to port 8443 or 443 on the UniFi Controller host from the web server hosting UGatewayStats. 
- Local account on the UniFi Controller (no cloud UI accounts). 

### Screenshots

![Screenshot 1](https://raw.githubusercontent.com/stevesinchak/UGatewayStats/main/Screenshot1.jpg)

![Screenshot 2](https://raw.githubusercontent.com/stevesinchak/UGatewayStats/main/Screenshot2.jpg)

### Installation 

The best method to install is via git clone.  While at a prompt on your server in the root web folder (such as `/var/web/www`), run the following command:

```bash
git clone https://github.com/stevesinchak/UGatewayStats.git
```
Then following the configuration section below to customize for your UniFi Controller info. 

### Configuration

All configuration is limited to the config.php file found in the root of the installation. 

```php
<?php
// Full url to your UniFi Controller
// Example: 'https://192.168.1.100:443'  <-- No trailing slash!
$controller_url='<insert your controller URL>';

// Only use a local account here created on your controller
$controller_user='<insert local controller account username>';
$controller_password='<insert local controller account password>';

// typically you don't need to change these unless you have multiple sites
$site_id='default';
$controller_version='6.5.55'; // Requires UniFi Controller version 5.5 or newer
$debug=FALSE;
?>
```

### Updates

Similar to installation, you can run a git command from your web root folder to pull down any updates:

```bash
git pull
```

### Raspberry Pi Full Setup and Headless (no monitor) Installation
1. Download Raspberry Pi OS Lite (Rasbian) from [raspberrypi.com](https://www.raspberrypi.com/software/operating-systems/).
2. Write the downloaded image to a SDCard ([balenaEtcher](https://www.balena.io/etcher/) is a good choice).
3. Mount the boot partition of the SDCard on your PC/Mac by removing and re-inserting the USB reader.  Create a file simply called SSH which will enable SSH remote management upon first boot. 
4. If using WiFi on a headless setup, create a `wpa_supplicant.conf` file as described in the [official docs](https://www.raspberrypi.com/documentation/computers/configuration.html#configuring-networking31). 
5. SSH into the Pi with `SSH pi@<IP address>` and use the default `raspberry` password. 
6. Apply all updates to the system with `sudo apt-get update` and `sudo apt-get upgrade`.





