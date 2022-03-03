var version = "0.2";
var scaleRX = "MB";
var scaleTX = "MB";
var scaleTotal = "MB";

function convertUnixTimeToTime(unixTime)
{
    var date = new Date(unixTime);
    return date.toLocaleTimeString();
}

function convertUnixTimeToDateTime(unixTime)
{
    var date = new Date(unixTime);
    return date.toLocaleString();
}

function convertUnixTimeToDate(unixTime)
{
    var date = new Date(unixTime);
    return date.toLocaleDateString();
}

function convertUnixTimeToDateUTC(unixTime)
{
    var date = new Date(unixTime);
    return date.toUTCString();
}
function convertUnixTimeToMonthUTC(unixTime)
{
    var date = new Date(unixTime);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[date.getUTCMonth()]+' '+date.getUTCFullYear();
}

function calculateBytesLabel(bytes)
{
    if (bytes < 1000) return "B";
    if (bytes < (1000*1000)) return "KB";
    if (bytes < (1000*1000*1000)) return "MB";
    if (bytes < (1000*1000*1000*1000)) return "GB";
    if (bytes < (1000*1000*1000*1000*1000)) return "TB";
    if (bytes < (1000*1000*1000*1000*1000*1000)) return "PB";
    return "B";
}

function convertBytesToKiloBytes(bytes)
{
    return Math.round((bytes/(1000)) * 1000 + Number.EPSILON) / 1000;
}

function convertBytesToMegaBytes(bytes)
{
    return Math.round((bytes/(1000*1000)) * 1000 + Number.EPSILON) / 1000;
}

function convertBytesToGigaBytes(bytes)
{
    return Math.round((bytes/(1000*1000*1000)) * 1000 + Number.EPSILON) / 1000;
}

function convertBytesToTeraBytes(bytes)
{
    return Math.round((bytes/(1000*1000*1000*1000)) * 1000 + Number.EPSILON) / 1000;
}

function convertBytesToPetaBytes(bytes)
{
    return Math.round((bytes/(1000*1000*1000*1000*1000)) * 1000 + Number.EPSILON) / 1000;
}

function bootstrapTableFormatterRX(value) {
    return value + ' ' + scaleRX;
}

function bootstrapTableFormatterTX(value) {
    return value + ' ' + scaleTX;
}

function bootstrapTableFormatterTotal(value) {
    return value + ' ' + scaleTotal;
}

function processDataAndSetupChartAndTable(apiJSON, mode)
{
    // Get max values of RX and TX
    var maxTX = 0, maxRX = 0;
    apiJSON.forEach(function (dataPoint) {
        if (dataPoint['wan-tx_bytes'] > maxTX) maxTX = dataPoint['wan-tx_bytes'];
        if (dataPoint['wan-rx_bytes'] > maxRX) maxRX = dataPoint['wan-rx_bytes'];
    });
    
    // Calculate scale for data points based on max values and set global variables
    scaleRX = calculateBytesLabel(maxRX);
    scaleTX = calculateBytesLabel(maxTX);

    if (maxRX > maxTX)
    {
        scaleTotal = scaleRX;
    } else {
        scaleTotal = scaleTX;
    }

    
    // Process JSON into three data arrays
    var labels = [], dataTX = [], dataRX = [], dataTotal = [];
    apiJSON.forEach(function (dataPoint) {
        if (mode == 'minutes')
        {
            labels.push(convertUnixTimeToTime(dataPoint.time));
        } 
        else if (mode == 'hourly')
        {
            labels.push(convertUnixTimeToDateTime(dataPoint.time));
        }
        else if (mode == 'daily')
        {
            labels.push(convertUnixTimeToDate(dataPoint.time));
        }
        else if (mode == 'monthly')
        {
            labels.push(convertUnixTimeToMonthUTC(dataPoint.time));
        }

        // Process RX based on scale
        if (scaleRX=="KB") { dataRX.push(convertBytesToKiloBytes(dataPoint['wan-rx_bytes']));
        } else if (scaleRX=="MB") { dataRX.push(convertBytesToMegaBytes(dataPoint['wan-rx_bytes']));
        } else if (scaleRX=="GB") { dataRX.push(convertBytesToGigaBytes(dataPoint['wan-rx_bytes']));
        } else if (scaleRX=="TB") { dataRX.push(convertBytesToTeraBytes(dataPoint['wan-rx_bytes']));
        } else if (scaleRX=="PB") { dataRX.push(convertBytesToPetaBytes(dataPoint['wan-rx_bytes']));
        } else {
            dataRX.push(dataPoint['wan-rx_bytes']);
        }

        // Process TX based on scale
        if (scaleTX=="KB") { dataTX.push(convertBytesToKiloBytes(dataPoint['wan-tx_bytes']));
        } else if (scaleTX=="MB") { dataTX.push(convertBytesToMegaBytes(dataPoint['wan-tx_bytes']));
        } else if (scaleTX=="GB") { dataTX.push(convertBytesToGigaBytes(dataPoint['wan-tx_bytes']));
        } else if (scaleTX=="TB") { dataTX.push(convertBytesToTeraBytes(dataPoint['wan-tx_bytes']));
        } else if (scaleTX=="PB") { dataTX.push(convertBytesToPetaBytes(dataPoint['wan-tx_bytes']));
        } else {
            dataTX.push(dataPoint['wan-tx_bytes']);
        }

        // Process Total based on scale
        if (scaleTotal=="KB") { dataTotal.push(convertBytesToKiloBytes(dataPoint['wan-rx_bytes']+dataPoint['wan-tx_bytes']));
        } else if (scaleTotal=="MB") { dataTotal.push(convertBytesToMegaBytes(dataPoint['wan-rx_bytes']+dataPoint['wan-tx_bytes']));
        } else if (scaleTotal=="GB") { dataTotal.push(convertBytesToGigaBytes(dataPoint['wan-rx_bytes']+dataPoint['wan-tx_bytes']));
        } else if (scaleTotal=="TB") { dataTotal.push(convertBytesToTeraBytes(dataPoint['wan-rx_bytes']+dataPoint['wan-tx_bytes']));
        } else if (scaleTotal=="PB") { dataTotal.push(convertBytesToPetaBytes(dataPoint['wan-rx_bytes']+dataPoint['wan-tx_bytes']));
        } else {
            dataTotal.push(dataPoint['wan-rx_bytes']+dataPoint['wan-tx_bytes']);
        }
        
    });

    var downloadChartCanvas = document.getElementById('downloadChart');
    var uploadChartCanvas = document.getElementById('uploadChart');

    var downloadChartCanvasGradient = document.getElementById('downloadChart').getContext('2d');
    var downloadGradient = downloadChartCanvasGradient.createLinearGradient(0, 0, 0, 750);
    downloadGradient.addColorStop(1, '#0678F0');
    downloadGradient.addColorStop(0, '#5CD57F');

    var uploadChartCanvasGradient = document.getElementById('uploadChart').getContext('2d');
    var uploadGradient = uploadChartCanvasGradient.createLinearGradient(0, 0, 0, 750);
    uploadGradient.addColorStop(1, '#0678F0');
    uploadGradient.addColorStop(0, '#5CD57F');

    var downloadData = {
        labels: labels,
        datasets: [
            {
                label: scaleRX + " Transferred",
                backgroundColor: downloadGradient,
                data: dataRX
            }
        ]
    };

    var uploadData = {
        labels: labels,
        datasets: [
            {
                label: scaleTX+ ' Transferred',
                backgroundColor: uploadGradient,
                data: dataTX
            }
        ]
    };

    // Setup download chart
    var downloadChart = new Chart(downloadChartCanvas, {
        type: 'bar',
        data: downloadData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Download'
                },
                legend: {
                        display: false
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, values) {
                            return value + ' ' + scaleRX;
                        }
                    }
                }
            }
        }
    });

    // Setup upload chart
    var uploadChart = new Chart(uploadChartCanvas, {
        type: 'bar',
        data: uploadData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Upload'
                },
                legend: {
                        display: false
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, values) {
                            return value + ' ' + scaleTX;
                        }
                    }
                }
            }
        }
    });

    // Combine data arrays for table
    var formattedBandwidthData = [];
    for (var x = 0; x < labels.length; ++x)
    {
        formattedBandwidthData.push({time: labels[x], download: dataRX[x], upload: dataTX[x], total: dataTotal[x]});
    }

    // Build the table
    $('#bandwidth-table').bootstrapTable({
        columns: [
            {field: 'time', title: 'Period'},
            {field: 'download', title: 'Download Bandwidth (' + scaleRX + ')', sortable: true, formatter: bootstrapTableFormatterRX},
            {field: 'upload', title: 'Upload Bandwidth (' + scaleTX + ')', sortable: true, formatter: bootstrapTableFormatterTX},
            {field: 'total', title: 'Total Bandwidth (' + scaleTotal + ')', sortable: true, formatter: bootstrapTableFormatterTotal}
        ],
        data: formattedBandwidthData
    })
    
}

function getDataFromUnifiAPI(mode = 'minutes')
{
    var jsonStatData = $.ajax({
        url: 'json/unifi_api.php?m=' + mode,
        dataType: 'json',
        error: function(details){ alert("Error making request to json/unifi_api.php: " + details.statusText)},
        success: function (results){ processDataAndSetupChartAndTable(results, mode)}
    });
}

// Grab query string to determine mode that will be passed to JSON unifi_api.php
var query_string = new URLSearchParams(window.location.search);
var mode='minutes'; //default

// Set mode and update header title
if (query_string.get('m') == 'hourly') {
    mode = 'hourly';
    $('#reportTitle').text('- Per Hour (7 Days)');
} else if (query_string.get('m') == 'daily') {
    mode = 'daily';
    $('#reportTitle').text('- Per Day (12 Months or Max Data)');
} else if (query_string.get('m') == 'monthly') {
    mode = 'monthly';
    $('#reportTitle').text('- Per Month (12 Months or Max Data)');
}
else
{
    mode='minutes';
    $('#reportTitle').text('- Per 5 Minutes (Last 12 Hours)');
}

// Do Stuff!
getDataFromUnifiAPI(mode);

$('#versionText').text(version);