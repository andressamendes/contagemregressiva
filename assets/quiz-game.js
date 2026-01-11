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
let hintUsed = false;

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
function showPlayerSelection() {
    showScreen('player-selection-screen');
}

function selectPlayer(player) {
    currentPlayer = player;
    initGame();
}

function initGame() {
    currentQuestion = 0;
    score = 0;
    lives = 3;
    correctAnswers = 0;
    combo = 0;
    maxCombo = 0;
    hintUsed = false;
    
    // Set player avatar
    const avatarPath = `assets/${currentPlayer}-avatar.svg`;
    document.getElementById('player-avatar').src = avatarPath;
    document.getElementById('player-name-hud').textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
    
    showScreen('game-screen');
    showQuestion();
    createParticles();
}

// ==================== SHOW QUESTION ====================
// ==================== RESULT ====================
function showResult() {
    showScreen('result-screen');
    
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
    
    // Create medal element (using emoji as placeholder)
    const medalElement = document.getElementById('rank-medal');
    medalElement.innerHTML = `<div style="font-size: 150px;">${medal}</div>`;
    
    document.getElementById('rank-title').textContent = title;
    document.getElementById('result-message-text').textContent = message;
    
    // ==================== INTEGRATE WITH RANKING SYSTEM ====================
    if (typeof RankingSystem !== 'undefined' && currentPlayer) {
        // Record quiz game
        RankingSystem.recordQuizGame(
            currentPlayer,
            score,
            correctAnswers,
            quizData.length,
            maxCombo
        );
        
        // Show XP notification
        setTimeout(() => {
            const stats = RankingSystem.getPlayerStats(currentPlayer);
            alert(`🎉 +${score} XP!\n\nXP Total: ${stats.totalXP}\nRank: ${stats.rank.icon} ${stats.rank.name}`);
        }, 1000);
    }
}


// ==================== SELECT ANSWER ====================
function selectAnswer(selectedIndex) {
    const q = quizData[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    // Disable all options
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (selectedIndex === q.correct) {
        // CORRECT ANSWER
        options[selectedIndex].classList.add('correct');
        correctSound.play();
        
        correctAnswers++;
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        
        // Calculate score with combo multiplier
        const basePoints = 100;
        const comboBonus = combo > 1 ? (combo - 1) * 50 : 0;
        score += basePoints + comboBonus;
        
        // Show combo
        if (combo > 1) {
            showCombo(combo);
        }
        
        // Particles
        createSuccessParticles();
        
    } else {
        // WRONG ANSWER
        options[selectedIndex].classList.add('wrong');
        options[q.correct].classList.add('correct');
        wrongSound.play();
        
        combo = 0;
        lives--;
        updateLives();
        
        // Check game over
        if (lives === 0) {
            setTimeout(() => showResult(), 2000);
            return;
        }
        
        // Particles
        createErrorParticles();
    }
    
    // Next question after delay
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 2000);
}

// ==================== LIVES ====================
function updateLives() {
    const livesElements = document.querySelectorAll('.life');
    livesElements.forEach((life, index) => {
        if (index >= lives) {
            life.classList.add('lost');
        }
    });
}

// ==================== HINT ====================
function useHint() {
    if (hintUsed) return;
    
    hintUsed = true;
    document.getElementById('hint-btn').disabled = true;
    
    const q = quizData[currentQuestion];
    alert(`💡 Dica: ${q.hint}`);
}

// ==================== COMBO ====================
function showCombo(comboValue) {
    const comboDisplay = document.getElementById('combo-display');
    document.getElementById('combo-value').textContent = comboValue;
    
    comboDisplay.classList.remove('hidden');
    comboDisplay.classList.add('show');
    
    setTimeout(() => {
        comboDisplay.classList.remove('show');
        setTimeout(() => {
            comboDisplay.classList.add('hidden');
        }, 500);
    }, 1000);
}

// ==================== PARTICLES ====================
function createParticles() {
    const container = document.getElementById('particles-container');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = 'rgba(255, 30, 30, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `floatParticle ${Math.random() * 10 + 5}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

function createSuccessParticles() {
    const container = document.getElementById('particles-container');
    const emojis = ['❤️', '💖', '✨', '⭐', '💕'];
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
        particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

function createErrorParticles() {
    const container = document.getElementById('particles-container');
    const emojis = ['💔', '😢', '⚡'];
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 150 + 'px');
        particle.style.setProperty('--ty', (Math.random() - 0.5) * 150 + 'px');
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

// Add particle animation to CSS dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes floatParticle {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
}
`;
document.head.appendChild(style);

// ==================== RESULT ====================
function showResult() {
    showScreen('result-screen');
    
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
    
    // Create medal element (using emoji as placeholder)
    const medalElement = document.getElementById('rank-medal');
    medalElement.innerHTML = `<div style="font-size: 150px;">${medal}</div>`;
    
    document.getElementById('rank-title').textContent = title;
    document.getElementById('result-message-text').textContent = message;
}

// ==================== RESTART ====================
function restartGame() {
    currentPlayer = null;
    showScreen('start-screen');
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
});
