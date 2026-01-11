// ==================== CHALLENGE DATA ====================
const missionsData = [
    {
        day: 1,
        icon: "💌",
        title: "Mensagem Especial",
        description: "Envie uma mensagem de bom dia com um motivo pelo qual você ama ela hoje"
    },
    {
        day: 2,
        icon: "📸",
        title: "Memória Fotográfica",
        description: "Tire uma foto de algo que te lembra ela e compartilhe"
    },
    {
        day: 3,
        icon: "🎵",
        title: "Trilha Sonora do Amor",
        description: "Envie uma música que representa o que você sente por ela"
    },
    {
        day: 4,
        icon: "💝",
        title: "Lista de Gratidão",
        description: "Liste 5 coisas que você mais ama nela"
    },
    {
        day: 5,
        icon: "🌟",
        title: "Elogio Sincero",
        description: "Faça um elogio genuíno que você nunca disse antes"
    },
    {
        day: 6,
        icon: "📝",
        title: "Carta Curta",
        description: "Escreva uma mini carta contando seu momento favorito juntas"
    },
    {
        day: 7,
        icon: "🎁",
        title: "Promessa",
        description: "Faça uma promessa de algo especial que farão juntas em breve"
    },
    {
        day: 8,
        icon: "☕",
        title: "Café Virtual",
        description: "Marque um horário para conversarem por vídeo tomando algo juntas"
    },
    {
        day: 9,
        icon: "🌹",
        title: "Poesia do Coração",
        description: "Crie ou compartilhe um verso que representa o amor de vocês"
    },
    {
        day: 10,
        icon: "🎬",
        title: "Indicação Especial",
        description: "Indique um filme ou série para assistirem juntas (ou separadas mas ao mesmo tempo)"
    },
    {
        day: 11,
        icon: "🍕",
        title: "Plano Gourmet",
        description: "Planeje uma refeição especial que farão juntas (pode ser simples, mas com amor)"
    },
    {
        day: 12,
        icon: "💭",
        title: "Sonho Compartilhado",
        description: "Conte um sonho ou plano futuro que você tem com ela"
    },
    {
        day: 13,
        icon: "🎨",
        title: "Criatividade em Ação",
        description: "Crie algo criativo para ela (desenho, montagem, edit, meme romântico...)"
    },
    {
        day: 14,
        icon: "🌙",
        title: "Boa Noite Especial",
        description: "Envie uma mensagem de boa noite explicando por que ela é tão importante"
    },
    {
        day: 15,
        icon: "💖",
        title: "Declaração Final",
        description: "Faça uma declaração de amor resumindo esses 15 dias e o futuro juntas"
    }
];

// ==================== CHALLENGE STATE ====================
let currentPlayer = null;
let challengeData = {
    startDate: null,
    completedDays: [],
    currentStreak: 0,
    maxStreak: 0,
    lastCompletionDate: null
};

// ==================== AUDIO ====================
const completeSound = document.getElementById('complete-sound');

// ==================== LOCAL STORAGE MANAGEMENT ====================
function loadChallengeData() {
    const saved = localStorage.getItem('challengeData');
    if (saved) {
        challengeData = JSON.parse(saved);
    }
}

function saveChallengeData() {
    localStorage.setItem('challengeData', JSON.stringify(challengeData));
}

// ==================== PLAYER SELECTION ====================
function getCurrentPlayer() {
    // Try to get from URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const playerParam = urlParams.get('player');
    
    if (playerParam) {
        return playerParam.charAt(0).toUpperCase() + playerParam.slice(1);
    }
    
    // Try to get from localStorage
    const saved = localStorage.getItem('currentChallengePlayer');
    if (saved) {
        return saved;
    }
    
    // Show player selection
    return null;
}

function setCurrentPlayer(player) {
    currentPlayer = player;
    localStorage.setItem('currentChallengePlayer', player);
}

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ==================== START CHALLENGE ====================
function startChallenge() {
    // Check if player is already set
    currentPlayer = getCurrentPlayer();
    
    if (!currentPlayer) {
        // Prompt for player selection
        const player = prompt("Quem está jogando? Digite 'Andressa' ou 'Milena':");
        if (!player || (player.toLowerCase() !== 'andressa' && player.toLowerCase() !== 'milena')) {
            alert("Nome inválido! Digite 'Andressa' ou 'Milena'");
            return;
        }
        setCurrentPlayer(player.charAt(0).toUpperCase() + player.slice(1).toLowerCase());
        currentPlayer = player.charAt(0).toUpperCase() + player.slice(1).toLowerCase();
    }
    
    // Load data
    loadChallengeData();
    
    // Register start with ranking system
    if (typeof RankingSystem !== 'undefined') {
        RankingSystem.startChallenge(currentPlayer);
    }
    
    // Initialize if first time
    if (!challengeData.startDate) {
        challengeData.startDate = new Date().toISOString();
        saveChallengeData();
    }
    
    showScreen('challenge-screen');
    updateUI();
    createParticles();
}

// ==================== UPDATE UI ====================
function updateUI() {
    updateProgress();
    updateStreak();
    updateCurrentMission();
    renderTimeline();
    renderAchievements();
}

function updateProgress() {
    const completed = challengeData.completedDays.length;
    const total = 15;
    const percentage = (completed / total) * 100;
    
    document.getElementById('progress-bar').style.width = percentage + '%';
    document.getElementById('progress-text').textContent = `${completed}/${total}`;
}

function updateStreak() {
    document.getElementById('streak-value').textContent = challengeData.currentStreak;
}

function updateCurrentMission() {
    const nextDay = getNextMissionDay();
    
    if (nextDay === null) {
        // All missions completed
        showScreen('completion-screen');
        showCompletionStats();
        return;
    }
    
    const mission = missionsData[nextDay - 1];
    
    document.getElementById('mission-badge').textContent = `DIA ${mission.day}`;
    document.getElementById('mission-icon').textContent = mission.icon;
    document.getElementById('mission-title').textContent = mission.title;
    document.getElementById('mission-description').textContent = mission.description;
    
    // Check if already completed today
    const today = new Date().toDateString();
    const lastCompletion = challengeData.lastCompletionDate ? new Date(challengeData.lastCompletionDate).toDateString() : null;
    
    if (challengeData.completedDays.includes(nextDay)) {
        // Mission already completed
        document.getElementById('btn-complete').style.display = 'none';
        document.getElementById('mission-completed').classList.remove('hidden');
        document.getElementById('completed-date').textContent = `Completado em ${new Date(challengeData.lastCompletionDate).toLocaleDateString('pt-BR')}`;
    } else {
        document.getElementById('btn-complete').style.display = 'block';
        document.getElementById('mission-completed').classList.add('hidden');
    }
}

function getNextMissionDay() {
    for (let i = 1; i <= 15; i++) {
        if (!challengeData.completedDays.includes(i)) {
            return i;
        }
    }
    return null; // All completed
}

// ==================== COMPLETE MISSION ====================
function showCheckInConfirm() {
    document.getElementById('checkin-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('checkin-modal').classList.add('hidden');
    document.getElementById('reset-modal').classList.add('hidden');
}

function completeMission() {
    const nextDay = getNextMissionDay();
    if (nextDay === null) return;
    
    // Add to completed days
    challengeData.completedDays.push(nextDay);
    challengeData.completedDays.sort((a, b) => a - b);
    
    // Update streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const lastCompletion = challengeData.lastCompletionDate ? new Date(challengeData.lastCompletionDate).toDateString() : null;
    
    if (lastCompletion === yesterday) {
        // Consecutive day
        challengeData.currentStreak++;
    } else if (lastCompletion !== today) {
        // New streak or reset
        challengeData.currentStreak = 1;
    }
    
    if (challengeData.currentStreak > challengeData.maxStreak) {
        challengeData.maxStreak = challengeData.currentStreak;
    }
    
    challengeData.lastCompletionDate = new Date().toISOString();
    
    // Save
    saveChallengeData();
    
    // Register with ranking system
    if (typeof RankingSystem !== 'undefined') {
        RankingSystem.recordChallengeDay(currentPlayer, nextDay, challengeData.currentStreak);
    }
    
    // Close modal
    closeModal();
    
    // Play sound
    if (completeSound) {
        completeSound.play();
    }
    
    // Create celebration particles
    createCelebrationParticles();
    
    // Update UI
    updateUI();
    
    // Show success message
    setTimeout(() => {
        alert(`🎉 Missão do Dia ${nextDay} completada! Continue assim! 💕`);
    }, 500);
}

// ==================== TIMELINE ====================
function renderTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    const nextDay = getNextMissionDay();
    
    timeline.innerHTML = missionsData.map(mission => {
        const isCompleted = challengeData.completedDays.includes(mission.day);
        const isCurrent = mission.day === nextDay;
        const isLocked = mission.day > (nextDay || 16);
        
        let statusIcon = '🔒';
        let statusClass = 'locked';
        
        if (isCompleted) {
            statusIcon = '✓';
            statusClass = 'completed';
        } else if (isCurrent) {
            statusIcon = '▶';
            statusClass = 'current';
        }
        
        return `
            <div class="timeline-item ${statusClass}">
                <div class="timeline-day">DIA ${mission.day}</div>
                <div class="timeline-icon">${mission.icon}</div>
                <div class="timeline-content">
                    <h4 class="timeline-title-text">${mission.title}</h4>
                    <p class="timeline-description">${mission.description}</p>
                </div>
                <div class="timeline-status">${statusIcon}</div>
            </div>
        `;
    }).join('');
}

// ==================== ACHIEVEMENTS ====================
function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    if (!container) return;
    
    const achievements = [
        {
            icon: "🚀",
            name: "Início da Jornada",
            description: "Completou o primeiro dia",
            unlocked: challengeData.completedDays.length >= 1
        },
        {
            icon: "🔥",
            name: "Aquecendo",
            description: "Streak de 3 dias",
            unlocked: challengeData.maxStreak >= 3
        },
        {
            icon: "💪",
            name: "Meio Caminho",
            description: "Completou 7 dias",
            unlocked: challengeData.completedDays.length >= 7
        },
        {
            icon: "⚡",
            name: "Imparável",
            description: "Streak de 7 dias",
            unlocked: challengeData.maxStreak >= 7
        },
        {
            icon: "🌟",
            name: "Quase Lá",
            description: "Completou 10 dias",
            unlocked: challengeData.completedDays.length >= 10
        },
        {
            icon: "👑",
            name: "Mestre do Desafio",
            description: "Completou todos os 15 dias",
            unlocked: challengeData.completedDays.length === 15
        }
    ];
    
    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-card ${achievement.unlocked ? '' : 'locked'}">
            <div class="achievement-icon">${achievement.icon}</div>
            <h4 class="achievement-name">${achievement.name}</h4>
            <p class="achievement-description">${achievement.description}</p>
        </div>
    `).join('');
}

// ==================== COMPLETION SCREEN ====================
function showCompletionStats() {
    document.getElementById('final-streak').textContent = `Streak Máximo: ${challengeData.maxStreak} dias`;
    
    // Count unlocked achievements
    let unlockedCount = 0;
    if (challengeData.completedDays.length >= 1) unlockedCount++;
    if (challengeData.maxStreak >= 3) unlockedCount++;
    if (challengeData.completedDays.length >= 7) unlockedCount++;
    if (challengeData.maxStreak >= 7) unlockedCount++;
    if (challengeData.completedDays.length >= 10) unlockedCount++;
    if (challengeData.completedDays.length === 15) unlockedCount++;
    
    document.getElementById('final-achievements').textContent = `${unlockedCount} Conquistas Desbloqueadas`;
}

// ==================== RESET ====================
function confirmReset() {
    document.getElementById('reset-modal').classList.remove('hidden');
}

function resetChallenge() {
    if (confirm('ÚLTIMA CONFIRMAÇÃO: Apagar todo o progresso do desafio?')) {
        challengeData = {
            startDate: null,
            completedDays: [],
            currentStreak: 0,
            maxStreak: 0,
            lastCompletionDate: null
        };
        saveChallengeData();
        closeModal();
        location.reload();
    }
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

function createCelebrationParticles() {
    const container = document.getElementById('particles-container');
    const emojis = ['❤️', '💖', '✨', '⭐', '💕', '🎉', '🎊'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.position = 'fixed';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.fontSize = '2rem';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const tx = (Math.random() - 0.5) * 400 + 'px';
        const ty = (Math.random() - 0.5) * 400 + 'px';
        particle.style.setProperty('--tx', tx);
        particle.style.setProperty('--ty', ty);
        
        particle.style.animation = 'particleFloat 2s ease-out forwards';
        
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

// Add particle animations
const style = document.createElement('style');
style.innerHTML = `
@keyframes floatParticle {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
}

@keyframes particleFloat {
    0% {
        opacity: 1;
        transform: translate(0, 0) scale(0.5) rotate(0deg);
    }
    100% {
        opacity: 0;
        transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(720deg);
    }
}
`;
document.head.appendChild(style);

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadChallengeData();
    createParticles();
    
    // Auto-start if player is set
    const player = getCurrentPlayer();
    if (player && window.location.pathname.includes('challenge.html')) {
        // Don't auto-start, let user click button
    }
});
