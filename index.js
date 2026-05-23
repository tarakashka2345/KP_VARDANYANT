document.querySelectorAll('.dream-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const modalId = card.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log(`Открыта модалка: ${modalId}`);
        } else {
            console.error(`Модалка с id="${modalId}" не найдена!`);
        }
    });
});
document.querySelectorAll('[id^="modal"]').forEach(modal => {
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) closeBtn.addEventListener('click', (e) => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});

(function initDarknessAndMusic() {
    const overlay = document.getElementById('darknessOverlay');
    const musicIcon = document.getElementById('musicIcon');
    const audio = document.getElementById('bgMusic');
    let isDark = true;
    let musicStarted = false;

    if (!overlay || !musicIcon) return;

    function lightOnAndMusicStart() {
        if (!isDark) return;
        isDark = false;
        overlay.style.opacity = '0';
        const content = document.getElementById('page-content');
        if (content) content.classList.add('loaded');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 2000);
        if (!musicStarted && audio) {
            musicStarted = true;
            audio.play().catch(e => console.log('audio play blocked'));
            if (musicIcon) {
                musicIcon.style.background = '#aaa';
                musicIcon.style.color = '#000';
            }
        }
    }

    musicIcon.addEventListener('click', () => {
        lightOnAndMusicStart();
        if (musicStarted && window.toggleMusic) {
            window.toggleMusic();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            lightOnAndMusicStart();
            if (musicStarted && window.toggleMusic) window.toggleMusic();
        }
    });
})();

let angel = document.getElementById('angel');
let camen = document.getElementById('camen');
let text = document.getElementById('text');
let moon = document.getElementById('moon');
let scrollLimit = 0;

function getScrollLimit() {
    const dreamBlock = document.querySelector('.DREAM');
    if (dreamBlock) {
        const rect = dreamBlock.getBoundingClientRect();
        scrollLimit = rect.top + window.scrollY - 100;
    } else {
        scrollLimit = 900;
    }
}

function updateParallax() {
    let value = window.scrollY;
    let limitedValue = value;
    if (scrollLimit > 0 && value > scrollLimit) {
        limitedValue = scrollLimit;
    }
    if (moon) moon.style.transform = `translateX(${limitedValue * 1}px)`;
    if (angel) angel.style.transform = `translateY(${limitedValue * 1.3}px)`;
    if (text) text.style.transform = `translateY(${limitedValue * 0.6}px)`;
}

window.addEventListener('scroll', updateParallax);
window.addEventListener('resize', () => { getScrollLimit(); updateParallax(); });
window.addEventListener('load', () => { getScrollLimit(); updateParallax(); });

document.addEventListener('DOMContentLoaded', () => {
    const dreamCards = document.querySelectorAll('.dream-card');
    const modals = {
        modal1: document.getElementById('modal1'),
        modal2: document.getElementById('modal2'),
        modal3: document.getElementById('modal3'),
        modal4: document.getElementById('modal4')
    };
    function openModal(modal) { if(modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; } }
    function closeModal(modal) { if(modal) { modal.style.display = 'none'; document.body.style.overflow = ''; } }
    dreamCards.forEach(card => {
        const modalId = card.getAttribute('data-modal');
        if(modalId && modals[modalId]) {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(modals[modalId]);
            });
        }
    });
    Object.values(modals).forEach(modal => {
        if(!modal) return;
        const closeBtn = modal.querySelector('.close');
        if(closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeModal(modal); });
        modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(modal); });
    });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') Object.values(modals).forEach(m => { if(m?.style.display === 'flex') closeModal(m); }); });
});

const QUESTIONS = [
  { text: "How often do you dream?", options: ["Almost every night", "Several times a week", "Once a week or less", "Very rarely"] },
  { text: "Do you remember your dreams after waking up?", options: ["Very clearly", "Partially, in fragments", "Rarely, I forget quickly", "Almost never"] },
  { text: "Do you have recurring dreams?", options: ["Yes, often", "Sometimes", "Rarely", "Never"] },
  { text: "Do you experience lucid dreams (aware that you're dreaming)?", options: ["Regularly", "Occasionally", "A couple of times", "Never"] },
  { text: "What color are your dreams?", options: ["Always bright and colorful", "Mostly colorful", "Dark / black and white", "I don't notice"] }
];

let currentQuestionIndex = 0;
let userSelections = new Array(QUESTIONS.length).fill(null);

const startScreen = document.getElementById('startScreen');
const testScreen = document.getElementById('testScreen');
const resultScreen = document.getElementById('resultScreen');
const startLink = document.getElementById('startLink');
const nextBtn = document.getElementById('nextBtn');
const questionTextElem = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const progressIndicator = document.getElementById('progressIndicator');
const restartBtn = document.getElementById('restartBtn');
const resultsListEl = document.getElementById('resultsList');
const miniRoz = document.querySelector('.miniroz');

function getOverallResult(answers) {
    let score = 0;
    if (answers[0] === "Almost every night") score += 3;
    else if (answers[0] === "Several times a week") score += 2;
    else if (answers[0] === "Once a week or less") score += 1;
    if (answers[1] === "Very clearly") score += 3;
    else if (answers[1] === "Partially, in fragments") score += 2;
    else if (answers[1] === "Rarely, I forget quickly") score += 1;
    if (answers[2] === "Yes, often") score += 3;
    else if (answers[2] === "Sometimes") score += 2;
    else if (answers[2] === "Rarely") score += 1;
    if (answers[3] === "Regularly") score += 3;
    else if (answers[3] === "Occasionally") score += 2;
    else if (answers[3] === "A couple of times") score += 1;
    if (answers[4] === "Always bright and colorful") score += 2;
    else if (answers[4] === "Mostly colorful") score += 1;
    if (score >= 11) return "🔮 YOU ARE AN ACTIVE DREAMER. Your dreams are vivid, frequent, and well-remembered. (~15% of population)";
    else if (score >= 7) return "🌙 AVERAGE DREAM TYPE. You dream regularly and remember some of them. (60–70% of people)";
    else if (score >= 3) return "😴 MODERATE DREAM ACTIVITY. Rare dream recall, individual trait.";
    else return "💤 YOU ARE A RARE VISITOR TO THE WORLD OF DREAMS.";
}

function renderCurrentQuestion() {
    const qData = QUESTIONS[currentQuestionIndex];
    questionTextElem.textContent = qData.text;
    progressIndicator.textContent = `Question ${currentQuestionIndex+1} of ${QUESTIONS.length}`;
    optionsContainer.innerHTML = '';
    qData.options.forEach(opt => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = opt;
        if(userSelections[currentQuestionIndex] === opt) div.classList.add('selected');
        div.addEventListener('click', () => {
            document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            div.classList.add('selected');
            userSelections[currentQuestionIndex] = opt;
            nextBtn.disabled = false;
        });
        optionsContainer.appendChild(div);
    });
    nextBtn.disabled = userSelections[currentQuestionIndex] === null;
}

function showFinalResult() {
    for(let i=0;i<QUESTIONS.length;i++) if(!userSelections[i]) { currentQuestionIndex=i; renderCurrentQuestion(); showScreen(testScreen); return; }
    resultsListEl.innerHTML = `<div style="padding:0.5rem 0;">${getOverallResult(userSelections)}</div>`;
    showScreen(resultScreen);
}

function showScreen(screen) { startScreen.classList.add('hidden'); testScreen.classList.add('hidden'); resultScreen.classList.add('hidden'); screen.classList.remove('hidden'); }
function startTest() { currentQuestionIndex=0; userSelections.fill(null); renderCurrentQuestion(); if(miniRoz) miniRoz.classList.add('hidden-rose'); showScreen(testScreen); }
function resetAndRestart() { currentQuestionIndex=0; userSelections.fill(null); if(miniRoz) miniRoz.classList.remove('hidden-rose'); showScreen(startScreen); }

startLink.addEventListener('click', (e) => { e.preventDefault(); startTest(); });
nextBtn.addEventListener('click', () => { if(userSelections[currentQuestionIndex]!==null){ if(currentQuestionIndex+1 < QUESTIONS.length) { currentQuestionIndex++; renderCurrentQuestion(); } else showFinalResult(); } });
restartBtn.addEventListener('click', resetAndRestart);
showScreen(startScreen);

(function() {
    const audio = document.getElementById('bgMusic');
    const icon = document.getElementById('musicIcon');
    let isPlaying = false, userInteracted = false;
    window.toggleMusic = function() {
        if(!userInteracted) return;
        if(isPlaying) {
            audio.pause();
            isPlaying = false;
            if(icon){ icon.style.background='#555'; icon.style.color='#ddd'; }
        } else {
            audio.play().catch(e=>console.log);
            isPlaying = true;
            if(icon){ icon.style.background='#aaa'; icon.style.color='#000'; }
        }
    };
    if(icon) icon.addEventListener('click', () => { userInteracted=true; window.toggleMusic(); });
    document.addEventListener('keydown', (e) => { if(e.key==='m'||e.key==='M') { e.preventDefault(); userInteracted=true; window.toggleMusic(); } });
    document.addEventListener('click', () => { if(!userInteracted) userInteracted=true; }, { once: true });
})();

(function() {
    const canvas = document.getElementById('dreamStarsCanvas');
    if(!canvas) return;
    let ctx = canvas.getContext('2d');
    let width, height, stars = [];
    let mouseX = null, mouseY = null;
    const STAR_COUNT = 800;
    function resize() { const container = canvas.parentElement; width = container.clientWidth; height = container.clientHeight; canvas.width = width; canvas.height = height; }
    function random(min,max){ return min+Math.random()*(max-min); }
    function initStars(){
        stars = [];
        for(let i=0;i<STAR_COUNT;i++){
            stars.push({
                x: random(0,1), y: random(0,1),
                radius: random(0.8,2.2),
                baseBright: random(0.3,0.9),
                twinkle: random(0.1,0.5),
                speed: random(0.8,2.5),
                phase: random(0, Math.PI*2)
            });
        }
    }
    function drawStars(time){
        if(!ctx) return;
        ctx.clearRect(0,0,width,height);
        for(let s of stars){
            let x = s.x * width, y = s.y * height;
            let brightness = s.baseBright + s.twinkle * Math.sin(time * s.speed + s.phase);
            brightness = Math.min(0.95, Math.max(0.3, brightness));
            let radius = s.radius;
            let r=200+55*brightness, g=210+40*brightness, b=230+25*brightness;
            if(mouseX !== null && mouseY !== null){
                let dx = x - mouseX, dy = y - mouseY, dist = Math.hypot(dx,dy);
                if(dist < 120){
                    let infl = 1 - dist/120;
                    brightness = Math.min(1, brightness + infl*0.4);
                    radius = s.radius * (1+infl*0.6);
                    r = Math.min(255, r+70*infl);
                    g = Math.min(255, g+60*infl);
                }
            }
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2);
            ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${brightness*0.8})`;
            ctx.fill();
        }
    }
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        if(rect.width && rect.height) {
            let scaleX = canvas.width / rect.width;
            let scaleY = canvas.height / rect.height;
            let canvasX = (e.clientX - rect.left) * scaleX;
            let canvasY = (e.clientY - rect.top) * scaleY;
            if(canvasX >= 0 && canvasX <= canvas.width && canvasY >=0 && canvasY <= canvas.height) {
                mouseX = canvasX;
                mouseY = canvasY;
            } else {
                mouseX = null;
                mouseY = null;
            }
        }
    });
    let animationId, startTime=null;
    function animate(now){
        if(!ctx) return;
        if(!startTime) startTime=now;
        let t = (now-startTime)/1000;
        drawStars(t);
        animationId = requestAnimationFrame(animate);
    }
    function startCanvas(){
        if(animationId) cancelAnimationFrame(animationId);
        resize();
        initStars();
        startTime=null;
        animationId = requestAnimationFrame(animate);
    }
    window.addEventListener('resize', ()=>{ resize(); initStars(); });
    startCanvas();
})();

(function smoothScroll(){
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(()=>{}, 30);
    }, {passive:false});
})();

const phrases = [
   
];
function updateDream() {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    document.getElementById('dreamText').textContent = phrases[randomIndex];
}
updateDream();
setInterval(updateDream, 4000);

(function() {
    const dreamInput = document.getElementById('dreamInput');
    const saveBtn = document.getElementById('saveDreamBtn');
    const dreamChest = document.getElementById('dreamChest');
    const dreamsListUl = document.getElementById('dreamsList');
    const STORAGE_KEY = 'user_dreams';
    let dreamsArray = [];

    function loadDreams() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                dreamsArray = JSON.parse(stored);
                if (!Array.isArray(dreamsArray)) dreamsArray = [];
            } catch(e) { dreamsArray = []; }
        } else {
            dreamsArray = [];
        }
        updateChestVisibility();
    }

    function saveDreamsToLocal() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dreamsArray));
        updateChestVisibility();
        if (dreamChest && dreamChest.classList.contains('open')) {
            renderDreamsList();
        }
    }

    function renderDreamsList() {
        if (!dreamsListUl) return;
        if (dreamsArray.length === 0) {
            dreamsListUl.innerHTML = '<li style="opacity:0.6;">✨ No dreams yet. Tell your first dream above. ✨</li>';
            return;
        }
        let html = '';
        dreamsArray.forEach((dream, idx) => {
            html += `<li style="animation-delay: ${idx * 0.05}s;"> ${escapeHtml(dream)}</li>`;
        });
        dreamsListUl.innerHTML = html;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function updateChestVisibility() {
        if (!dreamChest) return;
        if (dreamsArray.length >= 5) {
            dreamChest.style.display = 'block';
            dreamChest.style.animation = 'fadeInChest 0.5s ease';
        } else {
            dreamChest.style.display = 'none';
            if (dreamChest.classList.contains('open')) {
                dreamChest.classList.remove('open');
            }
        }
    }

    function addNewDream() {
        let newDream = dreamInput ? dreamInput.value.trim() : '';
        if (newDream === '') {
            alert('Please describe your dream before saving.');
            return;
        }
        dreamsArray.push(newDream);
        saveDreamsToLocal();
        dreamInput.value = '';
        if (saveBtn) {
            saveBtn.style.transform = 'scale(0.97)';
            setTimeout(() => { if(saveBtn) saveBtn.style.transform = ''; }, 150);
        }
        if (dreamsArray.length === 5) {
            if (dreamChest) {
                dreamChest.style.animation = 'none';
                dreamChest.offsetHeight;
                dreamChest.style.animation = 'fadeInChest 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.2)';
            }
        }
        console.log('Сохранённые сны:', dreamsArray); 
    }

    function toggleChest() {
        if (!dreamChest || dreamsArray.length < 5) return;
        dreamChest.classList.toggle('open');
        if (dreamChest.classList.contains('open')) {
            renderDreamsList();
        }
    }

    if (!document.querySelector('#chestKeyframeStyle')) {
        const style = document.createElement('style');
        style.id = 'chestKeyframeStyle';
        style.textContent = `
            @keyframes fadeInChest {
                0% { opacity: 0; transform: translateY(30px) scale(0.8); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    if (saveBtn) saveBtn.addEventListener('click', addNewDream);
    if (dreamChest) dreamChest.addEventListener('click', toggleChest);
    loadDreams();
})();

const styleEyeCursor = document.createElement('style');
styleEyeCursor.textContent = `
    a, button, .dream-card, .option, .next-button, .start-link, .restart-button, .close, .music-icon, .save-dream-btn, 
    .dream-chest, .chest-lid, nav ul li a, .modal-info .close, [onclick], [role="button"], .dream-input, .start-link img,
    .dream-card * {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="white" stroke="black" stroke-width="1.5"/><circle cx="16" cy="16" r="4" fill="black"/></svg>') 16 16, auto !important;
    }
`;
document.head.appendChild(styleEyeCursor);

document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
    }
});


const thankYouBlock = document.createElement('div');
thankYouBlock.className = 'ending-gothic';
thankYouBlock.style.marginTop = '100px';
thankYouBlock.style.padding = '3rem 2rem';
thankYouBlock.style.textAlign = 'center';
thankYouBlock.style.borderTop = '2px solid rgba(150,150,150,0.5)';
thankYouBlock.style.borderBottom = '2px solid rgba(100,100,100,0.3)';
thankYouBlock.style.animation = 'fadeInUp 1s ease-out';
thankYouBlock.innerHTML = `
    <p style="font-family: 'UnifrakturMaguntia', 'Grenze Gotisch', cursive; font-size: 2rem; letter-spacing: 3px; color: #fff;"> Thank You, Dreamer </p>
    <p style="font-family: 'UnifrakturMaguntia', 'Grenze Gotisch', cursive; font-size: 1.2rem; margin-top: 15px; opacity: 0.9;"> May your nights be filled with silver shadows </p>
    <small style="display: block; margin-top: 20px; opacity: 0.6;">"The eye remembers every dream you've shared" — Gothic Whisper</small>
    <p style="margin-top: 15px; font-size: 0.9rem; color: #aaa;">Eye cursor • Lazy loading • Page visibility • Random gothic messages</p>
`;
const dreamContainer = document.querySelector('.DREAM');
if (dreamContainer) {
    dreamContainer.appendChild(thankYouBlock);
} else {
    document.body.appendChild(thankYouBlock);
}

const fadeUpStyle = document.createElement('style');
fadeUpStyle.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(fadeUpStyle);

const observer = new MutationObserver(() => {
    document.querySelectorAll('a, button, .dream-card, .option, .next-button, .start-link, .restart-button, .close, .music-icon, .save-dream-btn, .dream-chest, nav ul li a, .dream-input').forEach(el => {
        el.style.cursor = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"14\" fill=\"white\" stroke=\"black\" stroke-width=\"1.5\"/><circle cx=\"16\" cy=\"16\" r=\"4\" fill=\"black\"/></svg>') 16 16, auto";
    });
});
observer.observe(document.body, { childList: true, subtree: true });


  (function addGothicDreamGlow() {
        const GOTHIC_DREAMS = [
            "White light fades into the labyrinth of sleep",
            "Silver threads weave my silent vision",
            "I saw a city made of lunar dust",
            "Radiance touched my lashes — I ascend",
            "A transparent dream of the unspeakable",
            "White darkness beyond the window, stars within",
            "The garden of glass lilies blooms in slumber",
            "Moonlight dances in oblivion's embrace",
            "Echoes of light paint the dream in white",
            "Where the crystals of time rest in silence",
            "I sailed on a milky river of phantoms",
            "Luminous whisper: 'remember this dream'",
            "A white stag leads through the mist",
            "Glowing scriptures upon my closed eyelids",
            "A dream-memory of what never was",
            "Diamond dust scattered upon the pillow",
            "Wings of lunar glow carry me beyond",
            "Inside me — a silent choir of dreams",
            "I touch the white flame of fantasy",
            "The weaver of dreams spins silver silk",
            "A dream where the air glitters like frost",
            "White rainbow in the midnight sky",
            "Porcelain moon stares into my soul",
            "The shimmering forest promises a riddle",
            "Starfleet leaves traces on my eyelids",
            "Silent dream, overflowing with pale light",
            "I flew through a galaxy of mother-of-pearl",
            "White butterfly — the key to the dreamworld",
            "A whisper: 'you are asleep, yet the light is real'",
            "Shards of dreams gather into constellations",
            "The glowing shadow of my own 'I'",
            "Weightlessness and an endless horizon",
            "The white fire of dreams warms the spirit",
            "A silent cry in the radiant void",
            "Moonwebs catch forgotten reveries",
            "Pale specters dance in the dreamer's chamber",
            "The ghost of a dream kisses my brow"
        ];

        function getRandomTenGothicDreams() {
            const shuffled = [...GOTHIC_DREAMS];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled.slice(0, 10);
        }

        const container = document.createElement('div');
        container.className = 'dream-glow-section';
        container.innerHTML = `
            <div class="dream-glow-title">✧ 10 RANDOM DREAMS ✧</div>
            <div class="dream-glow-grid" id="gothicGlowGrid"></div>
        `;

        function insertGlowModule() {
            const endingBlock = document.querySelector('.ending-gothic');
            const dreamContainer = document.querySelector('.DREAM');
            if (endingBlock) {
                dreamContainer.insertBefore(container, endingBlock);
            } else if (dreamContainer) {
                dreamContainer.appendChild(container);
            } else {
                document.body.appendChild(container);
            }
        }

        function renderGothicDreams() {
            const grid = document.getElementById('gothicGlowGrid');
            if (!grid) return;
            const dreams = getRandomTenGothicDreams();
            grid.innerHTML = '';
            dreams.forEach((phrase, idx) => {
                const card = document.createElement('div');
                card.className = 'dream-glow-card';
                const delay = (idx * 0.12) % 1.5;
                card.style.animationDelay = `${delay}s`;
                
                const textSpan = document.createElement('div');
                textSpan.className = 'dream-glow-text';
                textSpan.innerText = `“${phrase}”`;
                
                card.appendChild(textSpan);
                
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    card.style.transition = 'all 0.1s linear';
                    card.style.boxShadow = '0 0 45px rgba(180, 180, 200, 0.9), 0 0 20px rgba(200,200,220,0.7)';
                    card.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        card.style.boxShadow = '';
                        card.style.transform = '';
                        card.style.transition = '';
                    }, 160);
                });
                
                grid.appendChild(card);
            });
        }

        insertGlowModule();
        renderGothicDreams();
        
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '⟳ RENEW VISIONS ⟳';
        refreshBtn.className = 'gothic-refresh-btn';
        
        refreshBtn.addEventListener('click', () => {
            renderGothicDreams();
            refreshBtn.style.transform = 'scale(0.96)';
            setTimeout(() => { refreshBtn.style.transform = ''; }, 120);
        });
        
        container.appendChild(refreshBtn);
    })();

(function() {
  const root = document.documentElement;
  const animations = document.querySelectorAll('*');
  
  function pauseEverything() {
    root.classList.add('site-paused');
    document.querySelectorAll('video, audio').forEach(m => m.pause());
  }
  
  function resumeEverything() {
    root.classList.remove('site-paused');
    document.querySelectorAll('video, audio').forEach(m => m.play());
  }
  
  document.addEventListener('visibilitychange', () => {
    document.hidden ? pauseEverything() : resumeEverything();
  });
})();


