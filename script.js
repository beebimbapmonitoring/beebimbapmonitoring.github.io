const CONFIG = { temp: { min: 32.5, max: 35.0 }, hum: { min: 55, max: 65 }, weight: 12.50 };
let hiveChart;

document.addEventListener("DOMContentLoaded", () => {
    // Check if user was already logged in
    if (localStorage.getItem("hive_isLoggedIn") === "true") {
        showDashboard();
    }
    initChart();
});

function goToLogin() {
    document.getElementById("landing-view").classList.add("hidden");
    document.getElementById("login-view").classList.remove("hidden");
}

function backToHome() {
    document.getElementById("login-view").classList.add("hidden");
    document.getElementById("landing-view").classList.remove("hidden");
}

function attemptLogin() {
    const email = document.getElementById("email-input").value;
    const pass = document.getElementById("password-input").value;

    if (email.endsWith("@gmail.com") && pass === "hive123") {
        localStorage.setItem("hive_isLoggedIn", "true");
        showDashboard();
    } else {
        document.getElementById("login-error").classList.remove("hidden");
    }
}

function showDashboard() {
    document.getElementById("landing-view").classList.add("hidden");
    document.getElementById("login-view").classList.add("hidden");
    document.getElementById("dashboard-view").classList.remove("hidden");
    
    // Start Data Updates
    setInterval(updateData, 2000);
    updateData();
}

function logout() {
    localStorage.removeItem("hive_isLoggedIn");
    location.reload();
}

function updateData() {
    const t = (Math.random()*(CONFIG.temp.max-CONFIG.temp.min)+CONFIG.temp.min).toFixed(1);
    const tempDisplay = document.getElementById('temp-display');
    if(tempDisplay) tempDisplay.innerText = t + "°C";

    if(hiveChart) {
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        if(hiveChart.data.labels.length > 10) {
            hiveChart.data.labels.shift();
            hiveChart.data.datasets[0].data.shift();
        }
        hiveChart.data.labels.push(time);
        hiveChart.data.datasets[0].data.push(t);
        hiveChart.update();
    }
}

function initChart() {
    const ctx = document.getElementById('hiveChart');
    if(!ctx) return;
    hiveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temp',
                data: [],
                borderColor: '#f1c40f',
                tension: 0.4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}
