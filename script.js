const API_KEY = '7093f7dc6628eb1b00bd7b2f';
const dropdowns = document.querySelectorAll('.dropdown select');
const button = document.getElementById('btn');

const updateValue = async (evt) => {
    evt.preventDefault();
    let fromCurrency = document.getElementById("fromCurrency").value;
    let toCurrency = document.getElementById("toCurrency").value;
    let amount = document.querySelector(".amount input");
    let amtValue = amount.value;

    if (amtValue === "" || isNaN(amtValue) || amtValue <= 0) {
        showNotification("Please enter a valid amount", "error");
        shakeElement(amount);
        return;
    }

    // Show loading state with spinner
    const button = document.getElementById('btn');
    const originalText = button.innerText;
    button.innerHTML = '<span class="loading-spinner"></span>Get Exchange Rate';
    button.disabled = true;

    // Add ripple effect
    createRipple(button, evt);

    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.result !== "success") {
            throw new Error("API error");
        }

        const rate = data.conversion_rates[toCurrency];
        const convertedAmount = (amtValue * rate).toFixed(2);

        // Enhanced result animation
        const msgElement = document.querySelector(".msg p");
        msgElement.style.opacity = '0';
        msgElement.style.transform = 'translateY(30px) scale(0.8)';

        setTimeout(() => {
            msgElement.innerText = `${amtValue} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
            msgElement.style.opacity = '1';
            msgElement.style.transform = 'translateY(0) scale(1)';

            // Create success particles
            createSuccessParticles();
        }, 300);

        showNotification("Conversion successful!", "success");

    } catch (error) {
        console.error("Conversion error:", error);
        showNotification("Failed to get exchange rate. Please try again.", "error");
        shakeElement(document.querySelector('.container'));
    } finally {
        // Reset button state
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 500);
    }
}

// Add notification system
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let option = document.createElement("option");
        option.innerText = currCode;
        option.value = currCode;
        if (select.id === "fromCurrency" && currCode === "USD") {
            option.selected = true;
        }
        if (select.id === "toCurrency" && currCode === "PKR") {
            option.selected = true;
        }
        select.append(option);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    })
}
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;

};
window.addEventListener("load", (evt) => {
    updateValue(evt);
})
btn.addEventListener("click", (evt) => {
    updateValue(evt);
});

// Add swap functionality
document.querySelector('.fa-arrow-right-arrow-left').addEventListener('click', () => {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');

    // Swap values
    const tempValue = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tempValue;

    // Update flags
    updateFlag(fromSelect);
    updateFlag(toSelect);

    // Auto-convert if amount is valid
    const amount = document.querySelector(".amount input").value;
    if (amount && !isNaN(amount) && amount > 0) {
        updateValue(new Event('click'));
    }
});

// Add real-time conversion on amount change
document.getElementById('amount').addEventListener('input', debounce(() => {
    const amount = document.querySelector(".amount input").value;
    if (amount && !isNaN(amount) && amount > 0) {
        updateValue(new Event('input'));
    }
}, 1000));

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Create floating particles
function createParticles() {
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
            document.body.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 8000);
        }, i * 500);
    }
}

// Create success particles burst
function createSuccessParticles() {
    const container = document.querySelector('.container');
    const rect = container.getBoundingClientRect();

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.background = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = (rect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top + rect.height / 2) + 'px';
        particle.style.zIndex = '1000';

        const angle = (i / 12) * Math.PI * 2;
        const velocity = 100 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        document.body.appendChild(particle);

        let x = 0, y = 0, opacity = 1;
        const animate = () => {
            x += vx * 0.02;
            y += vy * 0.02 + 2; // gravity
            opacity -= 0.02;

            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        requestAnimationFrame(animate);
    }
}

// Shake animation for errors
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Add shake keyframes to CSS dynamically
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Create ripple effect
function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (event?.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (event?.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    `;

    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple effect CSS
const rippleCSS = `
@keyframes rippleEffect {
    to {
        transform: scale(2);
        opacity: 0;
    }
}
`;

const rippleStyle = document.createElement('style');
rippleStyle.textContent = rippleCSS;
document.head.appendChild(rippleStyle);

// Initialize particles when page loads
window.addEventListener('load', () => {
    createParticles();

    // Recreate particles every 10 seconds
    setInterval(createParticles, 10000);
});

// Add enhanced swap animation
document.querySelector('.fa-arrow-right-arrow-left').addEventListener('click', (e) => {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const fromContainer = fromSelect.closest('.select-container');
    const toContainer = toSelect.closest('.select-container');

    // Add swap animation
    fromContainer.style.transform = 'translateX(100px)';
    toContainer.style.transform = 'translateX(-100px)';

    setTimeout(() => {
        // Swap values
        const tempValue = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = tempValue;

        // Update flags
        updateFlag(fromSelect);
        updateFlag(toSelect);

        // Reset positions
        fromContainer.style.transform = '';
        toContainer.style.transform = '';

        // Auto-convert if amount is valid
        const amount = document.querySelector(".amount input").value;
        if (amount && !isNaN(amount) && amount > 0) {
            updateValue(new Event('click'));
        }
    }, 200);
});

// Enhanced flag update with animation
const originalUpdateFlag = updateFlag;
updateFlag = (element) => {
    const img = element.parentElement.querySelector("img");

    // Fade out
    img.style.opacity = '0';
    img.style.transform = 'scale(0.8)';

    setTimeout(() => {
        // Update source
        let currCode = element.value;
        let countryCode = countryList[currCode];
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        img.src = newSrc;

        // Fade in
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }, 150);
};