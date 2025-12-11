// Global variable para sa Chart instance
let myChart = null;

// Dummy Data para sa Simulation (kunwari galing sa database)
const mockData = {
    temp: {
        label: 'Temperature History (°C)',
        data: [21, 22, 23, 22, 24, 22, 21],
        color: '#ffcd56' // Yellow-ish
    },
    humidity: {
        label: 'Humidity History (%)',
        data: [50, 52, 55, 53, 55, 54, 55],
        color: '#36a2eb' // Blue
    },
    weight: {
        label: 'Hive Weight (kg)',
        data: [15.5, 15.8, 16.0, 16.0, 15.9, 16.1, 16.0],
        color: '#4bc0c0' // Teal
    },
    audio: {
        label: 'Audio Decibels (dB)',
        data: [40, 42, 45, 41, 39, 42, 40],
        color: '#ff9f40' // Orange
    }
};

// Function: Ipakita ang Graph base sa pinindot na card
function showGraph(sensorType) {
    // 1. Ipakita ang chart container, itago ang video
    document.getElementById('detailsSection').style.display = 'block';
    document.getElementById('videoSection').style.display = 'none';
    const canvas = document.getElementById('detailChart');
    canvas.style.display = 'block';

    // 2. Sirain ang lumang chart kung meron man (para hindi magpatong-patong)
    if (myChart) {
        myChart.destroy();
    }

    // 3. Kunin ang data base sa sensorType (temp, humidity, etc.)
    const dataset = mockData[sensorType];

    // 4. Gumawa ng bagong Chart
    const ctx = canvas.getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 'Now'],
            datasets: [{
                label: dataset.label,
                data: dataset.data,
                borderColor: dataset.color,
                backgroundColor: dataset.color + '33', // Add transparency
                fill: true,
                tension: 0.4 // Smooth curves
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false }
            }
        }
    });

    // Scroll to details section smoothly
    document.getElementById('detailsSection').scrollIntoView({ behavior: 'smooth' });
}

// Function: Ipakita ang Video Panel
function showVideoPanel() {
    document.getElementById('detailsSection').style.display = 'block';
    document.getElementById('detailChart').style.display = 'none'; // Itago ang chart
    document.getElementById('videoSection').style.display = 'block'; // Ipakita ang video

    // Populate fake logs
    const logList = document.getElementById('videoLogs');
    logList.innerHTML = `
        <li>✅ 14:05 - Motion Detected (Worker Bees)</li>
        <li>✅ 12:30 - Beekeeper Maintenance</li>
        <li>⚠️ 09:15 - Unknown Object Detected</li>
    `;

    document.getElementById('detailsSection').scrollIntoView({ behavior: 'smooth' });
}

// Function: Mock Live Stream
function startLiveStream() {
    alert("📡 Connecting to live camera feed... (This is a simulation)");
    const video = document.getElementById('videoClip');
    video.play();
}

// Function: Download CSV Logs
function downloadLogs() {
    const rows = [
        ["Timestamp", "Sensor", "Value", "Status"],
        ["2025-01-01 10:00", "Temp", "22C", "Normal"],
        ["2025-01-01 10:00", "Humidity", "55%", "Normal"],
        ["2025-01-01 10:00", "Weight", "16kg", "Stable"]
    ];

    let csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "juBEES_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// (Optional) Auto-update dashboard numbers randomizer para mukhang live
setInterval(() => {
    // Randomize Temp slightly
    const currentTemp = 21 + Math.floor(Math.random() * 3);
    document.getElementById('temp').innerText = currentTemp + " °C";
}, 3000); // Updates every 3 seconds
