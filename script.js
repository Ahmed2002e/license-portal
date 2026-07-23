const LICENSE_DB = {
    'PL-2026-04821': {
        number: 'PL-2026-04821',
        name: 'John Smith',
        type: 'Professional License',
        issueDate: '15 March 2026',
        expiryDate: '15 March 2031',
        status: 'VALID'
    },
    'PL-2025-03294': {
        number: 'PL-2025-03294',
        name: 'Sarah Johnson',
        type: 'Professional License',
        issueDate: '01 July 2025',
        expiryDate: '01 July 2030',
        status: 'VALID'
    },
    'CL-2024-01107': {
        number: 'CL-2024-01107',
        name: 'Ahmed Hassan',
        type: 'Commercial License',
        issueDate: '20 November 2024',
        expiryDate: '20 November 2029',
        status: 'VALID'
    },
    'ML-2026-07538': {
        number: 'ML-2026-07538',
        name: 'Maria Garcia',
        type: 'Medical License',
        issueDate: '10 January 2026',
        expiryDate: '10 January 2031',
        status: 'VALID'
    },
    'EL-2024-05612': {
        number: 'EL-2024-05612',
        name: 'David Williams',
        type: 'Engineering License',
        issueDate: '05 September 2024',
        expiryDate: '05 September 2029',
        status: 'VALID'
    }
};

let currentSection = 'home';

// --- Navigation ---
function showSection(section) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');

    if (section === 'home') {
        document.getElementById('hero-section').style.display = '';
        document.getElementById('result-section').style.display = 'none';
        document.getElementById('about-section').style.display = 'none';
        document.querySelector('.nav-link:nth-child(1)').classList.add('active');
    } else if (section === 'verify') {
        document.getElementById('hero-section').style.display = '';
        document.getElementById('result-section').style.display = 'none';
        document.getElementById('about-section').style.display = 'none';
        document.querySelector('.nav-link:nth-child(2)').classList.add('active');
        setTimeout(() => document.getElementById('license-input').focus(), 100);
    } else if (section === 'about') {
        document.getElementById('hero-section').style.display = 'none';
        document.getElementById('result-section').style.display = 'none';
        document.getElementById('about-section').style.display = '';
        document.querySelector('.nav-link:nth-child(3)').classList.add('active');
    }
    currentSection = section;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Tabs ---
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    if (tab === 'license') {
        document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
        document.getElementById('tab-license').classList.add('active');
    } else {
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
        document.getElementById('tab-qr').classList.add('active');
    }
}

// --- Input ---
function clearInput() {
    const input = document.getElementById('license-input');
    input.value = '';
    input.focus();
    document.querySelector('.clear-input').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('license-input');
    const clearBtn = document.querySelector('.clear-input');

    input.addEventListener('input', () => {
        clearBtn.style.display = input.value.length > 0 ? 'flex' : 'none';
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') verifyLicense();
    });

    animateStats();
});

// --- Stats Animation ---
function animateStats() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateNumber(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
}

function animateNumber(el, target) {
    const duration = 1800;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + (target === 99 && progress >= 1 ? '%' : '');
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + (target === 99 ? '%' : '');
    }
    requestAnimationFrame(update);
}

// --- Verify License ---
function verifyLicense() {
    const input = document.getElementById('license-input');
    const licenseNum = input.value.trim().toUpperCase();

    if (!licenseNum) {
        input.focus();
        input.style.borderColor = '#e74c3c';
        setTimeout(() => input.style.borderColor = '', 1500);
        return;
    }

    document.getElementById('hero-section').style.display = 'none';
    document.getElementById('result-section').style.display = '';
    document.getElementById('result-card').style.display = 'none';
    document.getElementById('loading-overlay').style.display = '';

    document.querySelectorAll('.loader-steps .step').forEach(s => {
        s.classList.remove('active', 'done');
    });

    const steps = document.querySelectorAll('.loader-steps .step');
    steps[0].classList.add('active');

    let delay = 0;
    steps.forEach((step, i) => {
        setTimeout(() => {
            step.classList.remove('active');
            step.classList.add('done');
            if (i < steps.length - 1) {
                steps[i + 1].classList.add('active');
            }
        }, delay += 650);
    });

    setTimeout(() => {
        document.getElementById('loading-overlay').style.display = 'none';
        showResult(licenseNum);
    }, 2800);
}

function showResult(licenseNum) {
    const resultCard = document.getElementById('result-card');
    const validDiv = document.getElementById('result-valid');
    const invalidDiv = document.getElementById('result-invalid');
    const license = LICENSE_DB[licenseNum];

    if (license) {
        invalidDiv.style.display = 'none';
        validDiv.style.display = '';

        document.getElementById('res-name').textContent = license.name;
        document.getElementById('res-number').textContent = license.number;
        document.getElementById('res-type').textContent = license.type;
        document.getElementById('res-issue').textContent = license.issueDate;
        document.getElementById('res-expiry').textContent = license.expiryDate;
        document.getElementById('res-status').textContent = license.status;
        document.getElementById('res-vid').textContent = generateVerificationId();

        const qrContainer = document.getElementById('result-qr-code');
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
            text: window.location.origin + window.location.pathname + '?license=' + license.number,
            width: 92,
            height: 92,
            colorDark: '#0a2463',
            colorLight: '#ffffff',
        });
    } else {
        validDiv.style.display = 'none';
        invalidDiv.style.display = '';
        document.getElementById('invalid-number').textContent = licenseNum;
    }

    resultCard.style.display = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateVerificationId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'VR-';
    for (let i = 0; i < 4; i++) id += chars[Math.floor(Math.random() * chars.length)];
    id += '-';
    for (let i = 0; i < 4; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

function goBack() {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('hero-section').style.display = '';
    document.getElementById('license-input').value = '';
    document.querySelector('.clear-input').style.display = 'none';
    document.documentElement.className = '';
    showSection('home');
}

// --- QR Upload Handler ---
function handleQRUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        switchTab('license');
        document.getElementById('license-input').value = 'PL-2026-04821';
        document.querySelector('.clear-input').style.display = 'flex';
        verifyLicense();
    };
    reader.readAsDataURL(file);
}

// --- Check URL params on load ---
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const license = params.get('license');
    if (license) {
        document.getElementById('license-input').value = license;
        document.querySelector('.clear-input').style.display = 'flex';
        verifyLicense();
    }
});
