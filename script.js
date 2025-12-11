// --- STATE VARIABLES ---
let isLoggedIn = false;
let currentUnit = 'C'; // C or F
let currentTheme = 'serika'; // serika, carbon, honey
let myChart = null;

// --- 1. LOGIN SYSTEM ---
function attemptLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Fake authentication (Simulated)
    if(user === 'admin' && pass === '1234') {
        isLoggedIn = true;
        document.getElementById('userDisplay').innerText = user;
        
        // Hide Login, Show Home & Nav
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
    
    // Hide all views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active-view');
        v.style.display = 'none';
    });

    // Show Login
    const loginPage = document.getElementById('login');
    loginPage.classList.add('active-view');
    loginPage.style.display = 'flex'; // Flex for center alignment
    
    // Clear inputs
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// --- 2. NAVIGATION ---
function navigate(viewId) {
    if(!isLoggedIn) return; // Prevent navigation if not logged in

    // Hide all
    document.querySelectorAll('.view').forEach(el => {
        el.classList.remove('active-view');
        el.style.display = 'none';
    });

    // Show Selected
    const selected = document.getElementById(viewId);
    selected.classList.add('active-view');
    
    if (viewId === 'dashboard') {
        selected.style.display = (window.innerWidth > 768) ? 'grid' : 'flex';
        renderChart(); // Refresh chart to match colors
    } else {
        selected.style.display = 'block';
    }

    // Update Nav Link Colors
    document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active-link'));
    const navItem = document.getElementById('nav-' + (viewId === 'home' || viewId === 'dashboard' ? viewId : 'settings'));
    if(navItem) navItem.classList.add('active-link');
}

// --- 3. SETTINGS & PERSONALIZATION ---

// Change Theme
function setTheme(themeName) {
    currentTheme = themeName;
    document.body.className = ''; // Reset classes
    if(themeName !== 'serika') {
        document.body.classList.add('theme-' + themeName);
    }

    // Update Buttons UI
    document.querySelectorAll('.setting-options .option-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(themeName)) btn.classList.add('active');
    });
}

// Change Unit
function setUnit(unit) {
    currentUnit = unit;
    
    // Update UI Buttons
    document.getElementById('btn-c').classList.toggle('active', unit === 'C');
    document.getElementById('btn-f').classList.toggle('active', unit === 'F');

    // Update Dashboard Value immediately (Simulation)
    const baseTemp = 28;
    const displayTemp = (unit === 'C') ? baseTemp : (baseTemp * 9/5) + 32;
    document.getElementById('tempDisplay').innerText = displayTemp + "°" + unit;
}

// Save Animation
function saveSettings() {
    const msg = document.getElementById('saveMsg');
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 2000);
}

// --- 4. DASHBOARD CHART ---
function renderChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    // Get colors from CSS variables to match theme
    const style = getComputedStyle(document.body);
    const mainColor = style.getPropertyValue('--main-color').trim();
    const subColor = style.getPropertyValue('--sub-color').trim();

    // Destroy old chart if exists
    if (myChart) myChart.destroy();

    // Convert data based on unit
    let rawData = [27, 28, 29, 28, 30, 28, 27];
    if (currentUnit === 'F') {
        rawData = rawData.map(c => (c * 9/5) + 32);
    }

    Chart.defaults.font.family = 'Roboto Mono';
    
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 'now'],
            datasets: [{
                label: 'Temperature',
                data: rawData,
                borderColor: mainColor,
                backgroundColor: mainColor,
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: subColor }, grid: { display: false } },
                y: { ticks: { color: subColor }, grid: { color: subColor + '33' } } // Transparent grid
            }
        }
    });
}

function showGraph(type) {
    document.querySelector('.chart-wrapper').style.display = 'block';
    document.getElementById('videoContainer').style.display = 'none';
    document.getElementById('contentTitle').innerText = type + "_history";
    renderChart();
}

function showVideoPanel() {
    document.querySelector('.chart-wrapper').style.display = 'none';
    document.getElementById('videoContainer').style.display = 'block';
    document.getElementById('contentTitle').innerText = "live_entrance_cam";
}

// Init (Start at Login)
window.onload = () => {
    // Force Login View on Load
    document.getElementById('login').style.display = 'flex';
};
