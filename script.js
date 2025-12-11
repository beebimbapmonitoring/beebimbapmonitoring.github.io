// --- NAVIGATION ---
function navigate(viewId) {
    document.querySelectorAll('.view').forEach(el => {
        el.classList.remove('active-view');
        el.style.display = 'none'; // Explicitly hide
    });

    const selected = document.getElementById(viewId);
    selected.classList.add('active-view');
    
    // Check specific display needs (Grid vs Block)
    if (viewId === 'dashboard') {
        selected.style.display = (window.innerWidth > 768) ? 'grid' : 'flex';
    } else {
        selected.style.display = 'block';
    }

    document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active-link'));
    const navItem = document.getElementById('nav-' + (viewId === 'dashboard' || viewId === 'home' ? viewId : 'about'));
    if(navItem) navItem.classList.add('active-link');
}

// --- DATA & CHART CONFIG ---
// Monkeytype Colors
const MT_MAIN = '#e2b714';
const MT_SUB = '#646669';
const MT_TEXT = '#d1d0c5';

let chartInstance = null;

const mockData = {
    temp: { label: 'temperature', data: [22, 23, 21, 24, 25, 23, 22] },
    humidity: { label: 'humidity', data: [55, 60, 58, 55, 53, 57, 55] },
    weight: { label: 'weight', data: [15, 15.2, 15.5, 15.8, 16, 16, 16] }
};

function showGraph(type) {
    document.getElementById('videoContainer').style.display = 'none';
    document.querySelector('.chart-wrapper').style.display = 'block';
    document.getElementById('contentTitle').innerText = type + "_graph";

    const ctx = document.getElementById('mainChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    // Chart.js Configuration to match Monkeytype
    Chart.defaults.font.family = 'Roboto Mono';
    Chart.defaults.color = MT_SUB;
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 'now'],
            datasets: [{
                label: mockData[type].label,
                data: mockData[type].data,
                borderColor: MT_MAIN,        // Yellow Line
                backgroundColor: MT_MAIN,    // Yellow Point
                pointBackgroundColor: MT_MAIN,
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }, // Hide legend for cleaner look
                tooltip: {
                    backgroundColor: '#323437',
                    titleColor: MT_MAIN,
                    bodyColor: MT_TEXT,
                    borderColor: MT_SUB,
                    borderWidth: 1,
                    displayColors: false,
                }
            },
            scales: {
                x: {
                    grid: { color: 'transparent' }, // No vertical grid lines
                    ticks: { color: MT_SUB }
                },
                y: {
                    grid: { color: '#444' }, // Very subtle horizontal lines
                    ticks: { color: MT_SUB }
                }
            }
        }
    });
}

function showVideoPanel() {
    document.querySelector('.chart-wrapper').style.display = 'none';
    document.getElementById('videoContainer').style.display = 'block';
    document.getElementById('contentTitle').innerText = "live_feed";
    
    // Simulate typing log
    const logDiv = document.getElementById('liveLog');
    let dots = 0;
    setInterval(() => {
        dots = (dots + 1) % 4;
        logDiv.innerText = "> monitoring_activity" + ".".repeat(dots);
    }, 500);
}

function downloadLogs() {
    alert("downloading_csv...");
}

// Init
window.onload = () => showGraph('temp');
