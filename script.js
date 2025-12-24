const CONFIG = { temp: { min: 32.5, max: 35.0 }, hum: { min: 55, max: 65 }, weight: 12.50 };
let hiveChart;
const DEFAULT_PROFILE = { name: "Admin", role: "Head Keeper", location: "Hive #01 Monitor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" };

document.addEventListener("DOMContentLoaded", () => {
    // 1. GENERATE MOVING BEES (Landing Swarm)
    const landingSwarm = document.getElementById('landing-swarm');
    if(landingSwarm) createSwarm(landingSwarm, 'landing-bee', 30);

    // 2. GENERATE MOVING BEES (Dashboard Swarm)
    const dashboardSwarm = document.getElementById('dashboard-swarm');
    if(dashboardSwarm) createSwarm(dashboardSwarm, 'dashboard-bee', 20);

    // 3. MOUSE FOLLOW (Queen)
    const bee = document.getElementById('bee-tracker'); // Corrected ID Selection
    if(bee) { document.addEventListener('mousemove', (e) => { const x = (window.innerWidth - e.pageX) / 25; const y = (window.innerHeight - e.pageY) / 25; bee.style.transform = `translateX(${x}px) translateY(${y}px)`; }); }
    
    // 4. AUTH CHECK
    if (localStorage.getItem("hive_isLoggedIn") === "true") {
        document.getElementById("landing-view").classList.add("hidden"); document.getElementById("dashboard-view").classList.remove("hidden"); document.getElementById("mobile-nav-bar").classList.remove("hidden");
        loadProfile(); initChart(); setInterval(updateData, 2000); setInterval(updateCamTime, 1000); updateData();
    }
    setTheme(localStorage.getItem("hive_theme") || "theme-dark");
});

function createSwarm(container, className, count) {
    for(let i=0; i<count; i++) {
        const b = document.createElement('div');
        b.className = className; // 'landing-bee' or 'dashboard-bee'
        b.style.left = Math.random() * 100 + 'vw';
        b.style.top = Math.random() * 100 + 'vh';
        b.style.animation = `flyAround ${5 + Math.random() * 15}s infinite linear`;
        b.style.animationDelay = `-${Math.random() * 15}s`;
        container.appendChild(b);
    }
}

function goToLogin() { document.getElementById("landing-view").classList.add("hidden"); document.getElementById("login-view").classList.remove("hidden"); document.getElementById("mobile-nav-bar").classList.add("hidden"); }
function backToHome() { document.getElementById("login-view").classList.add("hidden"); document.getElementById("landing-view").classList.remove("hidden"); }
function attemptLogin() {
    if (document.getElementById("email-input").value.trim().toLowerCase().endsWith("@gmail.com") && document.getElementById("password-input").value.trim() === "hive123") {
        localStorage.setItem("hive_isLoggedIn", "true"); localStorage.setItem("hive_userEmail", document.getElementById("email-input").value);
        document.getElementById("login-view").classList.add("hidden"); document.getElementById("dashboard-view").classList.remove("hidden"); document.getElementById("mobile-nav-bar").classList.remove("hidden");
        loadProfile(); initChart(); setInterval(updateData, 2000); setInterval(updateCamTime, 1000); updateData();
    } else { document.getElementById("login-error").classList.remove("hidden"); }
}
function logout() { localStorage.removeItem("hive_isLoggedIn"); location.reload(); }

function openSensorModal(type) {
    const modal = document.getElementById('sensor-modal'); modal.classList.remove('hidden');
    const title = document.getElementById('modal-sensor-title'), val = document.getElementById('modal-sensor-value'), desc = document.getElementById('modal-sensor-desc'), icon = document.getElementById('modal-sensor-icon');
    if (type === 'temp') { title.innerText = "Internal Temp"; val.innerText = document.getElementById('temp-display').innerText; desc.innerText = "Monitoring brood temperature for heat stress. Optimal: 28-32°C."; icon.innerHTML = '<i class="fas fa-temperature-high" style="color: #ff7675"></i>'; } 
    else if (type === 'humidity') { title.innerText = "Internal Humidity"; val.innerText = document.getElementById('hum-display').innerText; desc.innerText = "High humidity promotes fungal growth. Optimal: 60-70%."; icon.innerHTML = '<i class="fas fa-tint" style="color: #74b9ff"></i>'; } 
    else if (type === 'weight') { title.innerText = "Honey Stores (Weight)"; val.innerText = document.getElementById('weight-display').innerText; desc.innerText = "Weight increase indicates successful foraging and honey production."; icon.innerHTML = '<i class="fas fa-weight-hanging" style="color: #ffeaa7"></i>'; } 
    else if (type === 'audio') { title.innerText = "Colony Audio Analysis"; val.innerText = document.getElementById('audio-display').innerText; desc.innerText = "ML classifies buzzing frequency. High pitch may indicate predator stress."; icon.innerHTML = '<i class="fas fa-microphone-alt" style="color: #a29bfe"></i>'; }
    document.getElementById('modal-sensor-time').innerText = new Date().toLocaleTimeString();
}
function closeSensorModal() { document.getElementById('sensor-modal').classList.add('hidden'); }

function loadProfile() {
    const saved = JSON.parse(localStorage.getItem("hive_profile")) || DEFAULT_PROFILE;
    document.getElementById("sidebar-name").innerText = saved.name; document.getElementById("sidebar-role").innerText = saved.role;
    document.getElementById("sidebar-avatar").src = saved.avatar; document.getElementById("location-display").innerText = saved.location;
    document.getElementById("greeting-text").innerText = `Hello, ${saved.name}! 👋`; document.getElementById("nav-mini-avatar").src = saved.avatar;
    document.getElementById("edit-name").value = saved.name; document.getElementById("edit-role").value = saved.role; document.getElementById("edit-location").value = saved.location;
    document.querySelectorAll('.avatar-option').forEach(img => { if(img.src === saved.avatar) img.classList.add('selected'); else img.classList.remove('selected'); });
}
function selectAvatar(el) { document.querySelectorAll('.avatar-option').forEach(img => img.classList.remove('selected')); el.classList.add('selected'); }
function saveProfile() { localStorage.setItem("hive_profile", JSON.stringify({ name: document.getElementById("edit-name").value || "Admin", role: document.getElementById("edit-role").value || "Keeper", location: document.getElementById("edit-location").value || "Hive Monitor", avatar: document.querySelector('.avatar-option.selected').src })); loadProfile(); alert("✅ Profile Updated!"); switchTab('dashboard'); }

function switchTab(tabId) { document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden')); document.getElementById('view-' + tabId).classList.remove('hidden'); document.querySelectorAll('.nav-menu li, .nav-bottom li, .mobile-nav div').forEach(item => item.classList.remove('active')); document.querySelectorAll('.nav-item-' + tabId).forEach(item => item.classList.add('active')); }
function openVideoModal() { document.getElementById('video-modal').classList.remove('hidden'); }
function closeVideoModal() { document.getElementById('video-modal').classList.add('hidden'); }
function playVideo(el, text) { document.querySelectorAll('.log-item').forEach(i => i.classList.remove('active')); el.classList.add('active'); document.getElementById('video-status-text').innerText = "Playing: " + text; }
function updateCamTime() { document.getElementById('cam-time').innerText = new Date().toLocaleTimeString('en-US', {hour12: false}); }
function initChart() { const ctx = document.getElementById('hiveChart').getContext('2d'); hiveChart = new Chart(ctx, { type: 'line', data: { labels: [], datasets: [{ label: 'Temp', data: [], borderColor: '#ff7675', tension: 0.4 }, { label: 'Hum', data: [], borderColor: '#74b9ff', tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } }, animation: false } }); }

// UPDATED DATA FUNCTION FOR LOGS
function updateData() {
    const t = (Math.random()*(CONFIG.temp.max-CONFIG.temp.min)+CONFIG.temp.min).toFixed(1);
    const h = (Math.random()*(CONFIG.hum.max-CONFIG.hum.min)+CONFIG.hum.min).toFixed(0);
    CONFIG.weight += 0.005;
    document.getElementById('temp-display').innerText = t + "°C"; document.getElementById('hum-display').innerText = h + "%"; document.getElementById('weight-display').innerText = CONFIG.weight.toFixed(2) + " kg";
    const audioLevels = ["Low", "Normal", "Normal", "High"]; document.getElementById('audio-display').innerText = audioLevels[Math.floor(Math.random()*audioLevels.length)];
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if(hiveChart) { if(hiveChart.data.labels.length > 20) { hiveChart.data.labels.shift(); hiveChart.data.datasets[0].data.shift(); hiveChart.data.datasets[1].data.shift(); } hiveChart.data.labels.push(time); hiveChart.data.datasets[0].data.push(t); hiveChart.data.datasets[1].data.push(h); hiveChart.update(); }
    
    // NEW: Inject Styled Log Rows
    const statusType = Math.random() > 0.8 ? "Warning" : "Normal";
    const statusClass = statusType === "Normal" ? "badge-normal" : "badge-warning";
    const eventType = statusType === "Normal" ? "Traffic: Foraging" : "Audio: Stress Buzz";
    const confidence = (Math.random() * (99 - 85) + 85).toFixed(1) + "%";
    
    const tbody = document.querySelector("#logs-table tbody");
    const row = `
        <tr>
            <td>${time}</td>
            <td>${eventType}</td>
            <td class="conf-text" style="color:var(--accent)">${confidence}</td>
            <td><span class="log-badge ${statusClass}">${statusType}</span></td>
        </tr>
    `;
    tbody.insertAdjacentHTML('afterbegin', row);
    if(tbody.rows.length > 7) tbody.deleteRow(7);
}

function setTheme(theme) { document.body.className = theme; localStorage.setItem("hive_theme", theme); document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active')); document.querySelector(`.${theme}-btn`)?.classList.add('active'); }
function exportData() { alert("📥 Downloading CSV..."); }
function manualRefresh() { updateData(); }
