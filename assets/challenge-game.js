// ========================================
// CHALLENGE GAME - Sistema de Desafio 15 Dias
// ========================================

const ChallengeGame = {
    STORAGE_KEY: 'stChallengeProgress',
    currentPlayer: null,
    
    missions: [
        { day: 1, icon: '💌', title: 'Mensagem Especial', description: 'Envie uma mensagem de bom dia com um motivo pelo qual você ama ela hoje' },
        { day: 2, icon: '🎵', title: 'Playlist do Amor', description: 'Crie uma playlist com 5 músicas que lembram vocês duas' },
        { day: 3, icon: '📸', title: 'Foto Surpresa', description: 'Tire uma foto criativa e envie com uma legenda romântica' },
        { day: 4, icon: '🍰', title: 'Surpresa Doce', description: 'Prepare ou compre a sobremesa favorita dela' },
        { day: 5, icon: '💭', title: 'Memória Especial', description: 'Conte uma lembrança favorita de vocês juntas' },
        { day: 6, icon: '🎁', title: 'Presente Surpresa', description: 'Dê um presente simples mas significativo (pode ser feito à mão)' },
        { day: 7, icon: '🌟', title: 'Lista de Qualidades', description: 'Escreva 7 qualidades que você ama nela' },
        { day: 8, icon: '🎬', title: 'Cinema em Casa', description: 'Organize uma sessão de cinema com o filme favorito dela' },
        { day: 9, icon: '💐', title: 'Flores Virtuais', description: 'Envie fotos de flores com mensagens carinhosas' },
        { day: 10, icon: '🍕', title: 'Jantar Especial', description: 'Prepare ou peça a comida favorita dela' },
        { day: 11, icon: '✉️', title: 'Carta de Amor', description: 'Escreva uma carta de amor à mão ou digital' },
        { day: 12, icon: '🎨', title: 'Arte do Coração', description: 'Crie algo artístico para ela (desenho, colagem, edição)' },
        { day: 13, icon: '🌙', title: 'Boa Noite Especial', description: 'Envie uma mensagem de boa noite extra carinhosa' },
        { day: 14, icon: '🎉', title: 'Dia da Surpresa', description: 'Planeje uma surpresa completa para ela' },
        { day: 15, icon: '💕', title: 'Declaração Final', description: 'Faça uma declaração de amor épica resumindo esses 15 dias' }
    ],

    achievements: [
        { id: 'first_step', icon: '🌱', name: 'Primeiro Passo', description: 'Complete a primeira missão', requirement: 1 },
        { id: 'week_warrior', icon: '⚔️', name: 'Guerreiro de Uma Semana', description: 'Complete 7 missões', requirement: 7 },
        { id: 'streak_master', icon: '🔥', name: 'Mestre do Streak', description: 'Mantenha 5 dias consecutivos', requirement: 5 },
        { id: 'almost_there', icon: '🎯', name: 'Quase Lá', description: 'Complete 10 missões', requirement: 10 },
        { id: 'dedication', icon: '💪', name: 'Dedicação Total', description: 'Complete 12 missões', requirement: 12 },
        { id: 'champion', icon: '👑', name: 'Campeão do Amor', description: 'Complete todas as 15 missões', requirement: 15 }
    ],

    init() {
        this.loadProgress();
    },

    loadProgress() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? JSON.parse(saved) : this.createNewProgress();
    },

    createNewProgress() {
        const progress = {
            andressa: { completed: [], streak: 0, lastCompletedDate: null },
            milena: { completed: [], streak: 0, lastCompletedDate: null }
        };
        this.saveProgress(progress);
        return progress;
    },

    saveProgress(progress) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    },

    getPlayerProgress(playerId) {
        const progress = this.loadProgress();
        return progress[playerId] || { completed: [], streak: 0, lastCompletedDate: null };
    },

    startChallenge() {
        showScreen('challenge-screen');
        this.updateUI();
        this.renderTimeline();
        this.renderAchievements();
    },

    updateUI() {
        const playerProgress = this.getPlayerProgress('andressa');
        const completedCount = playerProgress.completed.length;
        const progressPercent = (completedCount / 15) * 100;

        document.getElementById('progress-bar').style.width = `${progressPercent}%`;
        document.getElementById('progress-text').textContent = `${completedCount}/15`;
        document.getElementById('streak-value').textContent = playerProgress.streak;

        this.updateCurrentMission();
    },

    updateCurrentMission() {
        const playerProgress = this.getPlayerProgress('andressa');
        const nextDay = playerProgress.completed.length + 1;

        if (nextDay > 15) {
            showScreen('completion-screen');
            this.showCompletionStats();
            return;
        }

        const mission = this.missions[nextDay - 1];
        const isCompleted = playerProgress.completed.includes(nextDay);

        document.getElementById('mission-badge').textContent = `DIA ${mission.day}`;
        document.getElementById('mission-icon').textContent = mission.icon;
        document.getElementById('mission-title').textContent = mission.title;
        document.getElementById('mission-description').textContent = mission.description;

        const btnComplete = document.getElementById('btn-complete');
        const missionCompleted = document.getElementById('mission-completed');

        if (isCompleted) {
            btnComplete.classList.add('hidden');
            missionCompleted.classList.remove('hidden');
            const completedDate = this.getCompletedDate(nextDay);
            document.getElementById('completed-date').textContent = `Completada em ${completedDate}`;
        } else {
            btnComplete.classList.remove('hidden');
            missionCompleted.classList.add('hidden');
        }
    },

    getCompletedDate(day) {
        const playerProgress = this.getPlayerProgress('andressa');
        return playerProgress.lastCompletedDate || new Date().toLocaleDateString('pt-BR');
    },

    renderTimeline() {
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '';

        const playerProgress = this.getPlayerProgress('andressa');
        const currentDay = playerProgress.completed.length + 1;

        this.missions.forEach(mission => {
            const isCompleted = playerProgress.completed.includes(mission.day);
            const isCurrent = mission.day === currentDay;
            const isLocked = mission.day > currentDay;

            const item = document.createElement('div');
            item.className = `timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`;

            item.innerHTML = `
                <div class="timeline-day">DIA ${mission.day}</div>
                <div class="timeline-icon">${mission.icon}</div>
                <div class="timeline-content">
                    <div class="timeline-title-text">${mission.title}</div>
                    <div class="timeline-description">${mission.description}</div>
                </div>
                <div class="timeline-status">
                    ${isCompleted ? '✅' : isLocked ? '🔒' : '⏳'}
                </div>
            `;

            timeline.appendChild(item);
        });
    },

    renderAchievements() {
        const grid = document.getElementById('achievements-grid');
        grid.innerHTML = '';

        const playerProgress = this.getPlayerProgress('andressa');
        const completedCount = playerProgress.completed.length;

        this.achievements.forEach(achievement => {
            const isUnlocked = completedCount >= achievement.requirement;

            const card = document.createElement('div');
            card.className = `achievement-card ${isUnlocked ? '' : 'locked'}`;

            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            `;

            grid.appendChild(card);
        });
    },

    completeMission() {
        const playerProgress = this.getPlayerProgress('andressa');
        const nextDay = playerProgress.completed.length + 1;

        if (nextDay > 15) return;

        // Update progress
        const progress = this.loadProgress();
        progress.andressa.completed.push(nextDay);
        
        // Update streak
        const today = new Date().toDateString();
        const lastDate = progress.andressa.lastCompletedDate;
        
        if (lastDate) {
            const lastDateObj = new Date(lastDate);
            const diffTime = Math.abs(new Date(today) - lastDateObj);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                progress.andressa.streak++;
            } else if (diffDays > 1) {
                progress.andressa.streak = 1;
            }
        } else {
            progress.andressa.streak = 1;
        }
        
        progress.andressa.lastCompletedDate = today;
        this.saveProgress(progress);

        // Add XP
        if (typeof RankingSystem !== 'undefined') {
            const baseXP = RankingSystem.xpValues.challengeDay;
            const streakXP = progress.andressa.streak > 1 ? 
                RankingSystem.xpValues.challengeStreak * (progress.andressa.streak - 1) : 0;
            const totalXP = baseXP + streakXP;

            RankingSystem.addXP('andressa', totalXP, 'challenge');
            RankingSystem.updateChallengeStats('andressa', {
                daysCompleted: progress.andressa.completed.length,
                currentStreak: progress.andressa.streak
            });

            // Check for achievements
            this.achievements.forEach(achievement => {
                if (progress.andressa.completed.length === achievement.requirement) {
                    RankingSystem.addAchievement('andressa', achievement.id);
                }
            });

            // Complete challenge bonus
            if (progress.andressa.completed.length === 15) {
                RankingSystem.addXP('andressa', RankingSystem.xpValues.challengeComplete, 'challenge_complete');
            }
        }

        // Play sound
        const sound = document.getElementById('complete-sound');
        if (sound) {
            sound.play().catch(() => {});
        }

        // Update UI
        this.updateUI();
        this.renderTimeline();
        this.renderAchievements();

        closeModal();
    },

    showCompletionStats() {
        const playerProgress = this.getPlayerProgress('andressa');
        
        document.getElementById('final-streak').textContent = `Streak Máximo: ${playerProgress.streak} dias`;
        
        const unlockedAchievements = this.achievements.filter(a => 
            playerProgress.completed.length >= a.requirement
        ).length;
        
        document.getElementById('final-achievements').textContent = 
            `${unlockedAchievements} Conquistas Desbloqueadas`;
    },

    reset() {
        const progress = this.loadProgress();
        progress.andressa = { completed: [], streak: 0, lastCompletedDate: null };
        this.saveProgress(progress);
        
        showScreen('start-screen');
    }
};

// ==================== GLOBAL FUNCTIONS ====================
function startChallenge() {
    ChallengeGame.startChallenge();
}

function showCheckInConfirm() {
    document.getElementById('checkin-modal').classList.remove('hidden');
}

function completeMission() {
    ChallengeGame.completeMission();
}

function confirmReset() {
    document.getElementById('reset-modal').classList.remove('hidden');
}

function resetChallenge() {
    ChallengeGame.reset();
    closeModal();
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ==================== INITIALIZATION ====================
if (typeof window !== 'undefined') {
    window.ChallengeGame = ChallengeGame;
    window.startChallenge = startChallenge;
    window.showCheckInConfirm = showCheckInConfirm;
    window.completeMission = completeMission;
    window.confirmReset = confirmReset;
    window.resetChallenge = resetChallenge;
    window.closeModal = closeModal;
    
    ChallengeGame.init();
}
