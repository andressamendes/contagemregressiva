// ==================== QUIZ DATA ====================
const quizData = [
    {
        question: "Quem mandou mensagem primeiro?",
        options: ["Andressa", "Milena", "As duas ao mesmo tempo", "Não lembro"],
        correct: 1,
        hint: "Ela é mais corajosa nessas horas! 💕"
    },
    {
        question: "Quem curtiu foto primeiro?",
        options: ["Andressa", "Milena", "Foi simultâneo", "Nenhuma das duas"],
        correct: 1,
        hint: "A mesma pessoa que mandou mensagem! 😊"
    },
    {
        question: "Quem chamou pra sair primeiro?",
        options: ["Andressa", "Milena", "Foi mútuo", "Um amigo sugeriu"],
        correct: 1,
        hint: "Ela que tomou a iniciativa em tudo no começo!"
    },
    {
        question: "Quem deu o beijo primeiro?",
        options: ["Andressa", "Milena", "Foi ao mesmo tempo", "Não lembro"],
        correct: 0,
        hint: "Dessa vez foi a outra! 💋"
    },
    {
        question: "Quem disse 'eu te amo' primeiro?",
        options: ["Andressa", "Milena", "Dissemos juntas", "Ainda não dissemos"],
        correct: 1,
        hint: "Ela sempre foi mais expressiva com os sentimentos! ❤️"
    },
    {
        question: "Quem é mais ciumenta?",
        options: ["Andressa", "Milena", "As duas igual", "Nenhuma"],
        correct: 1,
        hint: "Ciúmes é prova de amor! 💚"
    },
    {
        question: "Qual o primeiro filme que assistiram juntas?",
        options: ["O Céu É de Verdade", "Titanic", "La La Land", "Stranger Things"],
        correct: 0,
        hint: "Um filme inspirador e emocionante! 🎬"
    },
    {
        question: "Qual a primeira refeição juntas?",
        options: ["Hambúrguer", "Sushi", "Pizza", "Lasanha"],
        correct: 2,
        hint: "O clássico que nunca falha! 🍕"
    },
    {
        question: "O que mais gostam de fazer juntas?",
        options: ["Ver filmes", "Refeição livre e dormir agarradinhas", "Passear no parque", "Cozinhar juntas"],
        correct: 1,
        hint: "Momentos simples e aconchegantes! 🥰"
    },
    {
        question: "Quem é mais romântico(a)?",
        options: ["Andressa", "Milena", "As duas", "Depende do dia"],
        correct: 2,
        hint: "O amor é compartilhado igualmente! 💕"
    },
    {
        question: "Quem chora mais?",
        options: ["Andressa", "Milena", "As duas", "Nenhuma chora"],
        correct: 2,
        hint: "Sensibilidade é coisa das duas! 😢"
    },
    {
        question: "Quem dorme mais?",
        options: ["Andressa", "Milena", "As duas dormem igual", "Depende"],
        correct: 1,
        hint: "Ela adora uma soneca boa! 😴"
    },
    {
        question: "Quem briga mais?",
        options: ["Andressa", "Milena", "As duas", "Não brigam"],
        correct: 2,
        hint: "Todo casal tem seus momentos! 😅"
    },
    {
        question: "Quem reclama mais?",
        options: ["Andressa", "Milena", "As duas", "Nenhuma reclama"],
        correct: 0,
        hint: "Ela tem suas razões válidas! 😄"
    },
    {
        question: "Quem bagunça mais?",
        options: ["Andressa", "Milena", "As duas", "Nenhuma bagunça"],
        correct: 1,
        hint: "A organização não é o forte dela! 😊"
    },
    {
        question: "Quem é mais carinhosa?",
        options: ["Andressa", "Milena", "As duas igual", "Varia"],
        correct: 1,
        hint: "Ela derrete de carinho! 💖"
    },
    {
        question: "Quem se apaixonou primeiro?",
        options: ["Andressa", "Milena", "Foi ao mesmo tempo", "Ainda estamos descobrindo"],
        correct: 1,
        hint: "Ela caiu de amores primeiro! 😍"
    }
];

// ==================== GAME STATE ====================
let currentPlayer = null;
let currentQuestion = 0;
let score = 0;
let lives = 3;
let correctAnswers = 0;
let combo = 0;
let maxCombo = 0;

// ==================== AUDIO ====================
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ==================== START GAME ====================
function startGame(playerName) {
    currentPlayer = playerName;
    currentQuestion = 0;
    score = 0;
    lives = 3;
    correctAnswers = 0;
    combo = 0;
    maxCombo = 0;
    
    showScreen('question-screen');
    updateUI();
    showQuestion();
    createParticles();
}

// ==================== SHOW QUESTION ====================
function showQuestion() {
    if (currentQuestion >= quizData.length) {
        showResult();
        return;
    }

    const q = quizData[currentQuestion];
    const progress = ((currentQuestion + 1) / quizData.length) * 100;

    document.getElementById('question-number').textContent = `QUESTÃO ${currentQuestion + 1}`;
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('progress-bar').style.width = `${progress}%`;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    q.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });
}

// ==================== SELECT ANSWER ====================
function selectAnswer(selectedIndex) {
    const q = quizData[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === q.correct) {
        // CORRECT ANSWER
        buttons[selectedIndex].classList.add('correct');
        if (correctSound) correctSound.play();
        
        correctAnswers++;
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        
        const basePoints = 100;
        const comboBonus = combo > 1 ? (combo - 1) * 50 : 0;
        score += basePoints + comboBonus;
        
        if (combo >= 3) {
            showComboIndicator();
        }
        
        createSuccessParticles();
        
    } else {
        // WRONG ANSWER
        buttons[selectedIndex].classList.add('wrong');
        buttons[q.correct].classList.add('correct');
        if (wrongSound) wrongSound.play();
        
        combo = 0;
        lives--;
        
        createErrorParticles();
    }
    
    updateUI();
    
    if (lives === 0) {
        setTimeout(() => showResult(), 1500);
        return;
    }
    
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
}

// ==================== UPDATE UI ====================
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('combo').textContent = combo;

    const livesContainer = document.getElementById('lives-container');
    const hearts = livesContainer.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        if (index >= lives) {
            heart.classList.add('lost');
        } else {
            heart.classList.remove('lost');
        }
    });
}

// ==================== COMBO INDICATOR ====================
function showComboIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'combo-indicator';
    indicator.textContent = `${combo}x COMBO!`;
    document.body.appendChild(indicator);

    setTimeout(() => {
        indicator.remove();
    }, 1000);
}

// ==================== PARTICLES ====================
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(255, 30, 30, 0.6);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
        `;
        container.appendChild(particle);
    }
}

function createSuccessParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const emojis = ['❤️', '💖', '✨', '⭐', '💕'];
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            animation: explode 1.5s ease-out forwards;
        `;
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
        particle.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px');
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
    }
}

function createErrorParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const emojis = ['💔', '😢', '⚡'];
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            animation: explode 1.5s ease-out forwards;
        `;
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
        particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
    }
}

// Add animations
const style = document.createElement('style');
style.innerHTML = `
@keyframes explode {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
}
`;
document.head.appendChild(style);

// ==================== RESULT ====================
function showResult() {
    const percentage = (correctAnswers / quizData.length) * 100;
    
    // Update stats
    document.getElementById('final-score').textContent = score;
    document.getElementById('correct-answers').textContent = `${correctAnswers}/${quizData.length}`;
    document.getElementById('max-combo').textContent = `x${maxCombo}`;
    
    // Determine rank
    let medal, title, message;
    
    if (percentage === 100 && lives === 3) {
        medal = '🏆';
        title = 'MASTER DO AMOR!';
        message = 'PERFEITO! Vocês se conhecem como Eleven conhece os waffles! Conexão total no Upside Down do amor! 💕✨';
    } else if (percentage >= 90) {
        medal = '🥇';
        title = 'EXPERT ROMÂNTICO!';
        message = 'Incrível! Vocês têm uma conexão fortíssima! O Party ficaria orgulhoso! ❤️🔥';
    } else if (percentage >= 75) {
        medal = '🥈';
        title = 'CASAL CONECTADO!';
        message = 'Muito bem! Vocês se conhecem bastante! Continuem fortalecendo esse amor! 💖';
    } else if (percentage >= 60) {
        medal = '🥉';
        title = 'BOM COMEÇO!';
        message = 'Legal! Vocês estão no caminho certo. Cada dia conhecendo mais uma à outra! 💕';
    } else if (percentage >= 40) {
        medal = '🎖️';
        title = 'EXPLORADORES DO AMOR!';
        message = 'Tá começando! Como os meninos investigando Hawkins, vocês estão descobrindo mais! 💝';
    } else {
        medal = '💌';
        title = 'NOVA AVENTURA!';
        message = 'Hora de conversar mais e conhecer melhor sua amada! O amor está só começando! 💕';
    }
    
    document.getElementById('rank-medal').textContent = medal;
    document.getElementById('rank-title').textContent = title;
    document.getElementById('result-message-text').textContent = message;
    
    // ==================== INTEGRATE WITH RANKING SYSTEM ====================
    if (typeof RankingSystem !== 'undefined' && currentPlayer) {
        const playerId = currentPlayer.toLowerCase();
        const isPerfect = percentage === 100 && lives === 3;
        
        // Add XP
        RankingSystem.addXP(playerId, score, 'quiz');
        
        // Update stats
        RankingSystem.updateQuizStats(playerId, {
            score: score,
            perfect: isPerfect,
            maxCombo: maxCombo
        });
        
        // Check achievements
        if (isPerfect) {
            RankingSystem.addAchievement(playerId, 'quiz_perfect');
        }
        if (maxCombo >= 10) {
            RankingSystem.addAchievement(playerId, 'quiz_combo_master');
        }
    }
    
    showScreen('result-screen');
}

// ==================== INITIALIZATION ====================
if (typeof window !== 'undefined') {
    window.startGame = startGame;
}
