let isLoggedIn = false;
let currentUnit = 'C';
let myChart = null;
let updateInterval = null;
let activeSensor = 'temp';

// LOGIN
function attemptLogin() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();

    if(u !== "" && p !== "") {
        isLoggedIn = true;
        document.getElementById('userDisplay').innerText = u;
        document.getElementById('login').style.display = 'none';
        document.getElementById('mainNav').classList.remove('hidden');
        navigate('home');
        
        setTimeout(() => typeWriter("colony_status: healthy", "typewriter"), 500);
    } else {
        const err = document.getElementById('errorMsg');
        err.classList.remove('hidden');
        setTimeout(() => err.classList.add('hidden'), 2000);
    }
}

// TYPEWRITER
function typeWriter(text, elementId) {
    let i = 0;
    const speed = 80;
    const el = document.getElementById(elementId);
    el.innerHTML = "";
    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else { el.innerHTML += '<span style="animation:pulse 1s infinite">|</span>'; }
    }
    type();
}

function performLogout() {
    isLoggedIn = false;
    clearInterval(updateInterval);
    location.reload();
}

// NAV
function navigate(viewId) {
    if(!isLoggedIn) return;
    document.querySelectorAll('.view').forEach(el => {
        el.classList.remove('active-view');
        el.style.display = 'none';
    });
    const target = document.getElementById(viewId);
    target.style.display = (viewId === 'home') ? 'flex' : 'block';
    setTimeout(() => target.classList.add('active-view'), 10);

    document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active-link'));
    const navLink = document.getElementById('nav-' + (viewId === 'home' || viewId === 'dashboard' ? viewId : 'settings'));
    if(navLink) navLink.classList.add('active-link');

    if(viewId === 'dashboard') { initDashboard(); }
}

// DASHBOARD
const chartConfig = {
    temp: { label: 'Temperature', color: '#e2b714', base: 26, variance: 2 },
    humidity: { label: 'Humidity', color: '#3498db', base: 60, variance: 5 },
    weight: { label: 'Weight', color: '#2ecc71', base: 1.2, variance: 0.1 }
};
let currentData = Array(15).fill(0).map(() => 26); 

function initDashboard() {
    startClock();
    renderChart(activeSensor);
    if(updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(updateGraphData, 1500);
}

function switchSensor(sensor, el) {
    activeSensor = sensor;
    document.querySelectorAll('.kpi-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('chartTitle').innerText = "LIVE ANALYTICS // " + chartConfig[sensor].label.toUpperCase();
    const conf = chartConfig[sensor];
    currentData = Array(15).fill(0).map(() => conf.base);
    renderChart(sensor);
}

function updateGraphData() {
    if(!myChart) return;
    const conf = chartConfig[activeSensor];
    let newVal = conf.base + (Math.random() * conf.variance * 2 - conf.variance);
    if(activeSensor === 'temp' && currentUnit === 'F') newVal = (newVal * 9/5) + 32;
    if(activeSensor === 'temp') document.getElementById('tempDisplay').innerText = Math.round(newVal) + "°" + currentUnit;

    const dataset = myChart.data.datasets[0];
    dataset.data.shift();
    dataset.data.push(newVal);
    myChart.update('none');
}

function renderChart(type) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    const conf = chartConfig[type];
    if(myChart) myChart.destroy();
    
    Chart.defaults.font.family = 'Roboto Mono';
    Chart.defaults.color = '#646669';

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(15).fill(''),
            datasets: [{
                label: conf.label, data: [...currentData],
                borderColor: conf.color, backgroundColor: conf.color + '11',
                borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, fill: true, tension: 0.4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, animation: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: { legend: { display: false } },
            scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } }
        }
    });
}

// SETTINGS
function setTheme(theme) {
    document.body.className = ''; 
    if(theme !== 'serika') document.body.classList.add('theme-' + theme);
}

function setUnit(unit) {
    currentUnit = unit;
    document.getElementById('btn-c').classList.toggle('active', unit === 'C');
    document.getElementById('btn-f').classList.toggle('active', unit === 'F');
}

function startClock() {
    setInterval(() => {
        const d = new Date();
        document.getElementById('clock').innerText = d.getHours().toString().padStart(2,'0') + ":" + d.getMinutes().toString().padStart(2,'0');
    }, 1000);
}

window.onload = () => { document.getElementById('login').style.display = 'flex'; };
