let isLoggedIn = false;
let currentUnit = 'C';
let myChart = null;

// --- LOGIN LOGIC ---
function attemptLogin() {
    console.log("Login Attempted"); 
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();

    if(u !== "" && p !== "") {
        isLoggedIn = true;
        document.getElementById('userDisplay').innerText = u;
        document.getElementById('login').style.display = 'none';
        document.getElementById('mainNav').classList.remove('hidden');
        navigate('home');
    } else {
        const err = document.getElementById('errorMsg');
        err.classList.remove('hidden');
        setTimeout(() => err.classList.add('hidden'), 2000);
    }
}

function performLogout() {
    isLoggedIn = false;
    document.getElementById('mainNav').classList.add('hidden');
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active-view');
        v.style.display = 'none';
    });
    const login = document.getElementById('login');
    login.classList.add('active-view');
    login.style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// --- NAVIGATION ---
function navigate(viewId) {
    if(!isLoggedIn) return;
    document.querySelectorAll('.view').forEach(el => {
        el.classList.remove('active-view');
        el.style.display = 'none';
    });
    const target = document.getElementById(viewId);
    target.classList.add('active-view');
    target.style.display = 'block';

    document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active-link'));
    const navLink = document.getElementById('nav-' + (viewId === 'home' || viewId === 'dashboard' ? viewId : 'settings'));
    if(navLink) navLink.classList.add('active-link');

    if(viewId === 'dashboard') {
        renderChart('temp');
        startClock();
    }
}

// --- SETTINGS ---
function setTheme(theme) {
    document.body.className = '';
    if(theme !== 'serika') document.body.classList.add('theme-' + theme);
    document.querySelectorAll('.setting-options .option-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(theme)) btn.classList.add('active');
    });
}

function setUnit(unit) {
    currentUnit = unit;
    document.getElementById('btn-c').classList.toggle('active', unit === 'C');
    document.getElementById('btn-f').classList.toggle('active', unit === 'F');
    const baseTemp = 28;
    const val = (unit === 'C') ? baseTemp : (baseTemp * 9/5) + 32;
    document.getElementById('tempDisplay').innerText = Math.round(val) + "°" + unit;
}

function saveSettings() {
    const msg = document.getElementById('saveMsg');
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 2000);
}

// --- CHART & DASHBOARD ---
const mockData = {
    temp: { label: 'Temperature', data: [26, 27, 28, 28, 29, 28, 27] },
    humidity: { label: 'Humidity', data: [60, 62, 65, 64, 65, 63, 65] },
    weight: { label: 'Weight (kg)', data: [1.1, 1.1, 1.2, 1.2, 1.2, 1.2, 1.2] }
};

function renderChart(type) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    const style = getComputedStyle(document.body);
    const mainColor = style.getPropertyValue('--main-color').trim();
    const subColor = style.getPropertyValue('--sub-color').trim();
    let dataPoints = [...mockData[type].data];
    if(type === 'temp' && currentUnit === 'F') {
        dataPoints = dataPoints.map(t => (t * 9/5) + 32);
    }
    if(myChart) myChart.destroy();
    Chart.defaults.font.family = 'Roboto Mono';
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 'Now'],
            datasets: [{
                label: mockData[type].label,
                data: dataPoints,
                borderColor: mainColor,
                backgroundColor: mainColor,
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: subColor }, grid: { display: false } },
                y: { ticks: { color: subColor }, grid: { color: subColor + '22' } }
            }
        }
    });
}

function showGraph(type, el) {
    document.querySelectorAll('.kpi-card').forEach(c => c.classList.remove('active-card'));
    el.classList.add('active-card');
    document.querySelector('.chart-container-responsive canvas').style.display = 'block';
    document.getElementById('videoContainer').style.display = 'none';
    document.getElementById('contentTitle').innerText = mockData[type].label + " Analytics";
    renderChart(type);
}

function showVideoPanel(el) {
    document.querySelectorAll('.kpi-card').forEach(c => c.classList.remove('active-card'));
    el.classList.add('active-card');
    document.querySelector('.chart-container-responsive canvas').style.display = 'none';
    document.getElementById('videoContainer').style.display = 'block';
    document.getElementById('contentTitle').innerText = "Live Hive Entrance";
}

function startClock() {
    const update = () => {
        const now = new Date();
        const t = now.getHours().toString().padStart(2,'0') + ":" + now.getMinutes().toString().padStart(2,'0');
        const el = document.getElementById('clock');
        if(el) el.innerText = t;
    };
    setInterval(update, 1000);
    update();
}

window.onload = () => {
    document.getElementById('login').style.display = 'flex';
};
// Ensure Login shows on load
window.onload = () => {
    document.getElementById('login').style.display = 'flex';
};
