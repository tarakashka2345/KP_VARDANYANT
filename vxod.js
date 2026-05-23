const startScreen = document.getElementById('startScreen');
const registerScreen = document.getElementById('registerScreen');
const startBtn = document.getElementById('startButton');
const progressFill = document.getElementById('progressFill');
const form = document.getElementById('registrationForm');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const errorMsg = document.getElementById('errorMsg');
const formProgressFill = document.getElementById('formProgressFill');

let animationInterval = null;
let progress = 0;
const ANIMATION_DURATION = 1800;
const STEP_MS = 20;

function startProgressAndSwitch() {
    if (animationInterval) return;
    progress = 0;
    progressFill.style.width = '0%';
    const stepPercent = (STEP_MS / ANIMATION_DURATION) * 100;
    animationInterval = setInterval(() => {
        progress += stepPercent;
        if (progress >= 100) {
            progress = 100;
            progressFill.style.width = '100%';
            clearInterval(animationInterval);
            animationInterval = null;
            startScreen.classList.remove('active');
            registerScreen.classList.add('active');
        } else {
            progressFill.style.width = `${progress}%`;
        }
    }, STEP_MS);
}

function updateFormProgress() {
    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    
    let percent = 0;
    
    if (name.length > 0) {
        percent = 50;
    }
    
    if (age.length > 0) {
        percent = 100;
    }
    
    formProgressFill.style.width = `${percent}%`;
}

nameInput.addEventListener('input', updateFormProgress);
ageInput.addEventListener('input', updateFormProgress);

startBtn.addEventListener('click', startProgressAndSwitch);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    
    const name = nameInput.value.trim();
    const age = parseInt(ageInput.value, 10);
    
    if (!name) {
        errorMsg.textContent = 'укажи имя';
        return;
    }
    if (isNaN(age) || age < 12) {
        errorMsg.textContent = 'возраст должен быть 12 лет или больше';
        return;
    }
    
    localStorage.setItem('userName', name);
    localStorage.setItem('userAge', age);
    
    window.location.href = 'index.html';
});

registerScreen.classList.remove('active');
startScreen.classList.add('active');