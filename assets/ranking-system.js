// ==================== RANKING SYSTEM - CORE ====================
// Sistema central de pontuação e gamificação

const RankingSystem = {
    
    // ==================== CONFIGURAÇÕES ====================
    RANKS: [
        { level: 1, name: "Iniciante do Amor", minXP: 0, maxXP: 500, icon: "💕" },
        { level: 2, name: "Apaixonados", minXP: 500, maxXP: 1000, icon: "💖" },
        { level: 3, name: "Namorados Conectados", minXP: 1000, maxXP: 1500, icon: "💗" },
        { level: 4, name: "Casal Inseparável", minXP: 1500, maxXP: 2500, icon: "💝" },
        { level: 5, name: "Almas Gêmeas", minXP: 2500, maxXP: 3500, icon: "💞" },
        { level: 6, name: "Amor Lendário", minXP: 3500, maxXP: 4700, icon: "👑" },
        { level: 7, name: "Amor Eterno", minXP: 4700, maxXP: Infinity, icon: "✨" }
    ],

    ACHIEVEMENTS: {
        // Quiz Achievements
        quiz_first_play: { 
            id: "quiz_first_play", 
            name: "Primeira Aventura", 
            description: "Completou o quiz pela primeira vez", 
            icon: "🎮", 
            xp: 50 
        },
        quiz_perfect: { 
            id: "quiz_perfect", 
            name: "Conhecimento Perfeito", 
            description: "Acertou todas as perguntas do quiz", 
            icon: "🏆", 
            xp: 200 
        },
        quiz_combo_5: { 
            id: "quiz_combo_5", 
            name: "Combo Master", 
            description: "Atingiu combo de 5 acertos seguidos", 
            icon: "🔥", 
            xp: 100 
        },

        // Challenge Achievements
        challenge_started: { 
            id: "challenge_started", 
            name: "Início da Jornada", 
            description: "Iniciou o Desafio dos 15 Dias", 
            icon: "🚀", 
            xp: 50 
        },
        challenge_streak_5: { 
            id: "challenge_streak_5", 
            name: "Dedicação Consistente", 
            description: "Manteve streak de 5 dias", 
            icon: "⚡", 
            xp: 100 
        },
        challenge_streak_10: { 
            id: "challenge_streak_10", 
            name: "Compromisso Forte", 
            description: "Manteve streak de 10 dias", 
            icon: "💪", 
            xp: 150 
        },
        challenge_complete: { 
            id: "challenge_complete", 
            name: "Desafio Concluído", 
            description: "Completou os 15 dias de missões", 
            icon: "🎖️", 
            xp: 300 
        },

        // Global Achievements
        total_1000xp: { 
            id: "total_1000xp", 
            name: "Mil Pontos de Amor", 
            description: "Atingiu 1000 XP total", 
            icon: "⭐", 
            xp: 0 
        },
        total_2500xp: { 
            id: "total_2500xp", 
            name: "Mestria em Amor", 
            description: "Atingiu 2500 XP total", 
            icon: "🌟", 
            xp: 0 
        },
        all_games: { 
            id: "all_games", 
            name: "Explorador Completo", 
            description: "Jogou todos os jogos disponíveis", 
            icon: "🗺️", 
            xp: 200 
        }
    },

    // ==================== INICIALIZAÇÃO ====================
    init() {
        this.loadData();
    },

    loadData() {
        const saved = localStorage.getItem('rankingData');
        if (saved) {
            this.data = JSON.parse(saved);
        } else {
            this.data = this.getDefaultData();
            this.saveData();
        }
    },

    getDefaultData() {
        return {
            andressa: this.createPlayerData('Andressa'),
            milena: this.createPlayerData('Milena')
        };
    },

    createPlayerData(name) {
        return {
            name: name,
            totalXP: 0,
            currentRank: this.RANKS[0],
            achievements: [],
            games: {
                quiz: {
                    played: 0,
                    bestScore: 0,
                    totalScore: 0,
                    perfectGames: 0,
                    maxCombo: 0
                },
                challenge: {
                    started: false,
                    completed: false,
                    currentDay: 0,
                    maxStreak: 0,
                    completedDays: []
                }
            },
            lastActivity: null
        };
    },

    saveData() {
        localStorage.setItem('rankingData', JSON.stringify(this.data));
    },

    // ==================== PLAYER MANAGEMENT ====================
    getPlayer(playerName) {
        const key = playerName.toLowerCase();
        if (!this.data[key]) {
            this.data[key] = this.createPlayerData(playerName);
            this.saveData();
        }
        return this.data[key];
    },

    getAllPlayers() {
        return [this.data.andressa, this.data.milena];
    },

    // ==================== XP E RANK ====================
    addXP(playerName, amount, source) {
        const player = this.getPlayer(playerName);
        player.totalXP += amount;
        player.lastActivity = new Date().toISOString();
        
        // Update rank
        this.updateRank(player);
        
        // Save
        this.saveData();
        
        // Check for level-based achievements
        this.checkXPAchievements(playerName);
        
        return {
            newXP: player.totalXP,
            rank: player.currentRank,
            levelUp: this.checkLevelUp(player)
        };
    },

    updateRank(player) {
        for (let rank of this.RANKS) {
            if (player.totalXP >= rank.minXP && player.totalXP < rank.maxXP) {
                player.currentRank = rank;
                break;
            }
        }
    },

    checkLevelUp(player) {
        // Check if just leveled up
        return false; // Implement logic if needed
    },

    // ==================== ACHIEVEMENTS ====================
    unlockAchievement(playerName, achievementId) {
        const player = this.getPlayer(playerName);
        
        if (player.achievements.includes(achievementId)) {
            return false; // Already unlocked
        }
        
        const achievement = this.ACHIEVEMENTS[achievementId];
        if (!achievement) return false;
        
        player.achievements.push(achievementId);
        
        if (achievement.xp > 0) {
            this.addXP(playerName, achievement.xp, 'achievement');
        }
        
        this.saveData();
        return true;
    },

    checkXPAchievements(playerName) {
        const player = this.getPlayer(playerName);
        
        if (player.totalXP >= 1000) {
            this.unlockAchievement(playerName, 'total_1000xp');
        }
        if (player.totalXP >= 2500) {
            this.unlockAchievement(playerName, 'total_2500xp');
        }
        
        // Check if played all games
        if (player.games.quiz.played > 0 && player.games.challenge.started) {
            this.unlockAchievement(playerName, 'all_games');
        }
    },

    // ==================== QUIZ INTEGRATION ====================
    recordQuizGame(playerName, score, correctAnswers, totalQuestions, maxCombo) {
        const player = this.getPlayer(playerName);
        
        player.games.quiz.played++;
        player.games.quiz.totalScore += score;
        
        if (score > player.games.quiz.bestScore) {
            player.games.quiz.bestScore = score;
        }
        
        if (maxCombo > player.games.quiz.maxCombo) {
            player.games.quiz.maxCombo = maxCombo;
        }
        
        // Check achievements
        this.unlockAchievement(playerName, 'quiz_first_play');
        
        if (correctAnswers === totalQuestions) {
            player.games.quiz.perfectGames++;
            this.unlockAchievement(playerName, 'quiz_perfect');
        }
        
        if (maxCombo >= 5) {
            this.unlockAchievement(playerName, 'quiz_combo_5');
        }
        
        // Add XP
        this.addXP(playerName, score, 'quiz');
        
        this.saveData();
    },

    // ==================== CHALLENGE INTEGRATION ====================
    startChallenge(playerName) {
        const player = this.getPlayer(playerName);
        
        if (!player.games.challenge.started) {
            player.games.challenge.started = true;
            this.unlockAchievement(playerName, 'challenge_started');
            this.saveData();
        }
    },

    recordChallengeDay(playerName, dayNumber, streak) {
        const player = this.getPlayer(playerName);
        
        if (!player.games.challenge.completedDays.includes(dayNumber)) {
            player.games.challenge.completedDays.push(dayNumber);
            player.games.challenge.currentDay = dayNumber;
            
            if (streak > player.games.challenge.maxStreak) {
                player.games.challenge.maxStreak = streak;
            }
            
            // XP por missão + bônus de streak
            const xp = 100 + (streak * 10);
            this.addXP(playerName, xp, 'challenge');
            
            // Check streak achievements
            if (streak >= 5) {
                this.unlockAchievement(playerName, 'challenge_streak_5');
            }
            if (streak >= 10) {
                this.unlockAchievement(playerName, 'challenge_streak_10');
            }
            
            // Check completion
            if (player.games.challenge.completedDays.length === 15) {
                player.games.challenge.completed = true;
                this.unlockAchievement(playerName, 'challenge_complete');
                this.addXP(playerName, 100, 'challenge_complete'); // Bonus
            }
            
            this.saveData();
        }
    },

    // ==================== LEADERBOARD ====================
    getLeaderboard() {
        const players = this.getAllPlayers();
        return players.sort((a, b) => b.totalXP - a.totalXP);
    },

    // ==================== STATS ====================
    getPlayerStats(playerName) {
        const player = this.getPlayer(playerName);
        
        return {
            totalXP: player.totalXP,
            rank: player.currentRank,
            achievementsCount: player.achievements.length,
            totalAchievements: Object.keys(this.ACHIEVEMENTS).length,
            quizPlayed: player.games.quiz.played,
            quizBestScore: player.games.quiz.bestScore,
            challengeProgress: player.games.challenge.completedDays.length,
            challengeStreak: player.games.challenge.maxStreak
        };
    },

    // ==================== RESET ====================
    resetPlayer(playerName) {
        const key = playerName.toLowerCase();
        this.data[key] = this.createPlayerData(playerName);
        this.saveData();
    },

    resetAll() {
        this.data = this.getDefaultData();
        this.saveData();
    }
};

// Initialize on load
RankingSystem.init();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RankingSystem;
}
