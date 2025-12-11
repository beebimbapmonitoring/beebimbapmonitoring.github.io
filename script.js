// Function to handle interactions
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Variables ---
    const phoneInput = document.getElementById('phone');
    const termsCheck = document.getElementById('termsCheck');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnCheck = document.getElementById('btnCheck');
    const osInputs = document.querySelectorAll('input[name="os"]');

    // --- 2. Animations / Interactivity ---

    // Typewriter effect simulation for placeholder
    const phText = "input_numbers_only";
    let phIndex = 0;
    
    // Focus Effects
    phoneInput.addEventListener('focus', () => {
        phoneInput.placeholder = '';
    });
    phoneInput.addEventListener('blur', () => {
        phoneInput.placeholder = 'input_numbers_only';
    });


    // --- 3. Button Logic ---

    btnSubmit.addEventListener('click', () => {
        const phone = phoneInput.value;
        const os = document.querySelector('input[name="os"]:checked').value;

        if(phone.length < 5 || isNaN(phone)) {
            alert('error: invalid_phone_number');
            phoneInput.style.color = '#ca4754'; // Turn text red
            return;
        } else {
            phoneInput.style.color = '#d1d0c5'; // Reset color
        }

        if(!termsCheck.checked) {
            alert('error: terms_not_accepted');
            return;
        }

        // Success
        alert(`success: registered\nOS: ${os}\nPHONE: 010-${phone}`);
    });

    btnCheck.addEventListener('click', () => {
        alert('system: checking_database...');
    });

    // --- 4. Navigation ---
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Make badges clickable
    document.querySelectorAll('.badge').forEach(b => {
        b.addEventListener('click', () => {
            alert('redirect: ' + b.innerText);
        });
    });

});
// Init
window.onload = () => {
    document.getElementById('login').style.display = 'flex';
};
