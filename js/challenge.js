// ==========================================
// STRANGER THINGS COUNTDOWN - CHALLENGE.JS
// Lógica específica da página do Desafio 15 Dias
// ==========================================

// Configuração do Desafio
const CHALLENGE_CONFIG = {
    startDate: new Date('2026-01-01T00:00:00'),
    totalDays: 15,
    tasks: [
        { day: 1, title: 'Dia 1: Assistir 1 episódio de Stranger Things juntos', emoji: '📺', points: 10 },
        { day: 2, title: 'Dia 2: Cozinhar a receita favorita da Milena', emoji: '🍳', points: 15 },
        { day: 3, title: 'Dia 3: Escrever uma carta de amor', emoji: '💌', points: 20 },
        { day: 4, title: 'Dia 4: Tirar 10 fotos juntos', emoji: '📸', points: 10 },
        { day: 5, title: 'Dia 5: Fazer um piquenique', emoji: '🧺', points: 25 },
        { day: 6, title: 'Dia 6: Assistir o pôr do sol juntos', emoji: '🌅', points: 15 },
        { day: 7, title: 'Dia 7: Dançar nossa música favorita', emoji: '💃', points: 20 },
        { day: 8, title: 'Dia 8: Criar uma playlist especial', emoji: '🎵', points: 15 },
        { day: 9, title: 'Dia 9: Fazer uma maratona de filmes', emoji: '🎬', points: 20 },
        { day: 10, title: 'Dia 10: Preparar café da manhã na cama', emoji: '☕', points: 25 },
        { day: 11, title: 'Dia 11: Escrever 10 motivos do meu amor', emoji: '❤️', points: 30 },
        { day: 12, title: 'Dia 12: Fazer uma ligação surpresa', emoji: '📞', points: 15 },
        { day: 13, title: 'Dia 13: Planejar nossa próxima viagem', emoji: '✈️', points: 25 },
        { day: 14, title: 'Dia 14: Jantar romântico em casa', emoji: '🍷', points: 30 },
        { day: 15, title: 'Dia 15: Surpresa final especial!', emoji: '🎁', points: 50 }
    ]
};

// Estado do Desafio
const ChallengeState = {
    completedDays: [],
    totalPoints: 0,
    currentDay: 1
};

// Inicializar Desafio
function initChallenge() {
    console.log('🎯 Inicializando Desafio 15 Dias...');
    
    // Carregar progresso salvo
    loadChallengeProgress();
    
    // Calcular dia atual
    calculateCurrentDay();
    
    // Renderizar interface
    renderChallenge();
    
    // Iniciar contador regressivo
    startCountdown();
}

// Carregar progresso salvo
function loadChallengeProgress() {
    const savedProgress = Utils.loadFromStorage('challengeProgress');
    if (savedProgress) {
        ChallengeState.completedDays = savedProgress.completedDays || [];
        ChallengeState.totalPoints = savedProgress.totalPoints || 0;
    }
}

// Salvar progresso
function saveChallengeProgress() {
    Utils.saveToStorage('challengeProgress', {
        completedDays: ChallengeState.completedDays,
        totalPoints: ChallengeState.totalPoints,
        lastUpdate: Date.now()
    });
}

// Calcular dia atual do desafio
function calculateCurrentDay() {
    const now = new Date();
    const start = CHALLENGE_CONFIG.startDate;
    const diffTime = now - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    ChallengeState.currentDay = Math.max(1, Math.min(diffDays, CHALLENGE_CONFIG.totalDays));
}

// Renderizar interface do desafio
function renderChallenge() {
    const container = document.getElementById('challenge-container');
    if (!container) return;
    
    const completedCount = ChallengeState.completedDays.length;
    const progressPercentage = (completedCount / CHALLENGE_CONFIG.totalDays) * 100;
    const maxPoints = CHALLENGE_CONFIG.tasks.reduce((sum, task) => sum + task.points, 0);
    
    container.innerHTML = `
        <div class="challenge-header">
            <h2>Desafio 15 Dias de Amor</h2>
            <div class="challenge-stats">
                <div class="stat-card">
                    <span class="stat-value">${completedCount}</span>
                    <span class="stat-label">Dias Completos</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${ChallengeState.totalPoints}</span>
                    <span class="stat-label">Pontos</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${CHALLENGE_CONFIG.totalDays - completedCount}</span>
                    <span class="stat-label">Dias Restantes</span>
                </div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <p class="progress-text">${Math.round(progressPercentage)}% Concluído</p>
        </div>
        
        <div class="challenge-timeline">
            ${CHALLENGE_CONFIG.tasks.map(task => renderTask(task)).join('')}
        </div>
        
        <div class="challenge-actions">
            <button class="btn" onclick="resetChallenge()">Reiniciar Desafio</button>
            <button class="back-button" onclick="location.href='index.html'">← Voltar ao Início</button>
        </div>
    `;
}

// Renderizar tarefa individual
function renderTask(task) {
    const isCompleted = ChallengeState.completedDays.includes(task.day);
    const isCurrentDay = task.day === ChallengeState.currentDay;
    const isLocked = task.day > ChallengeState.currentDay;
    
    let statusClass = '';
    let statusText = '';
    
    if (isCompleted) {
        statusClass = 'completed';
        statusText = '✅ Completo';
    } else if (isCurrentDay) {
        statusClass = 'current';
        statusText = '▶️ Dia Atual';
    } else if (isLocked) {
        statusClass = 'locked';
        statusText = '🔒 Bloqueado';
    } else {
        statusClass = 'pending';
        statusText = '⏳ Pendente';
    }
    
    return `
        <div class="challenge-task ${statusClass}" data-day="${task.day}">
            <div class="task-emoji">${task.emoji}</div>
            <div class="task-content">
                <h3 class="task-title">${task.title}</h3>
                <div class="task-meta">
                    <span class="task-points">+${task.points} pontos</span>
                    <span class="task-status">${statusText}</span>
                </div>
            </div>
            ${!isCompleted && !isLocked ? `
                <button class="task-complete-btn" onclick="completeTask(${task.day})">
                    Concluir
                </button>
            ` : ''}
        </div>
    `;
}

// Completar tarefa
function completeTask(day) {
    if (ChallengeState.completedDays.includes(day)) {
        Toast.info('Essa tarefa já foi concluída!');
        return;
    }
    
    const task = CHALLENGE_CONFIG.tasks.find(t => t.day === day);
    if (!task) return;
    
    // Confirmar conclusão
    if (confirm(`Você completou a tarefa:\n\n${task.title}\n\n+${task.points} pontos`)) {
        // Adicionar aos dias completos
        ChallengeState.completedDays.push(day);
        ChallengeState.completedDays.sort((a, b) => a - b);
        
        // Adicionar pontos
        ChallengeState.totalPoints += task.points;
        
        // Salvar progresso
        saveChallengeProgress();
        
        // Feedback
        Toast.success(`Parabéns! +${task.points} pontos ganhos!`);
        Utils.vibrate(200);
        
        // Verificar se completou todos os dias
        if (ChallengeState.completedDays.length === CHALLENGE_CONFIG.totalDays) {
            setTimeout(() => {
                showChallengeCompleted();
            }, 1000);
        } else {
            // Re-renderizar
            renderChallenge();
        }
    }
}

// Mostrar tela de desafio completo
function showChallengeCompleted() {
    const container = document.getElementById('challenge-container');
    if (!container) return;
    
    const maxPoints = CHALLENGE_CONFIG.tasks.reduce((sum, task) => sum + task.points, 0);
    const percentage = Math.round((ChallengeState.totalPoints / maxPoints) * 100);
    
    container.innerHTML = `
        <div class="challenge-completed">
            <h2>🎉 DESAFIO COMPLETO! 🎉</h2>
            
            <div class="completion-stats">
                <div class="completion-emoji">🏆</div>
                <h3>Parabéns!</h3>
                <p>Você completou todos os 15 dias do desafio!</p>
                
                <div class="final-stats">
                    <div class="final-stat">
                        <span class="final-stat-value">${ChallengeState.totalPoints}</span>
                        <span class="final-stat-label">Pontos Totais</span>
                    </div>
                    <div class="final-stat">
                        <span class="final-stat-value">${percentage}%</span>
                        <span class="final-stat-label">Aproveitamento</span>
                    </div>
                </div>
                
                <p class="completion-message">
                    Nosso amor cresceu ainda mais nesses 15 dias especiais! ❤️
                </p>
            </div>
            
            <div class="completion-actions">
                <button class="btn" onclick="shareChallenge()">Compartilhar</button>
                <button class="btn" onclick="resetChallenge()">Fazer Novamente</button>
                <button class="back-button" onclick="location.href='index.html'">← Voltar ao Início</button>
            </div>
        </div>
    `;
    
    Toast.success('Desafio completo! Você é incrível!');
    Utils.vibrate([100, 50, 100, 50, 100]);
}

// Resetar desafio
function resetChallenge() {
    if (confirm('Tem certeza que deseja reiniciar o desafio? Todo o progresso será perdido.')) {
        ChallengeState.completedDays = [];
        ChallengeState.totalPoints = 0;
        saveChallengeProgress();
        Toast.info('Desafio reiniciado!');
        renderChallenge();
    }
}

// Compartilhar desafio
function shareChallenge() {
    const text = `Completei o Desafio 15 Dias de Amor! 💕\n${ChallengeState.totalPoints} pontos conquistados!\n\n#StrangerThings #DesafioDeAmor`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Desafio 15 Dias de Amor',
            text: text,
            url: window.location.href
        }).then(() => {
            Toast.success('Compartilhado com sucesso!');
        }).catch(() => {
            copyToClipboard(text);
        });
    } else {
        copyToClipboard(text);
    }
}

// Copiar para área de transferência
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            Toast.success('Copiado para área de transferência!');
        });
    } else {
        // Fallback para navegadores antigos
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        Toast.success('Copiado para área de transferência!');
    }
}

// Contador regressivo para próximo dia
function startCountdown() {
    const countdownElement = document.getElementById('next-day-countdown');
    if (!countdownElement) return;
    
    function updateCountdown() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownElement.textContent = `Próximo dia em: ${Utils.padZero(hours)}:${Utils.padZero(minutes)}:${Utils.padZero(seconds)}`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChallenge);
} else {
    initChallenge();
}
