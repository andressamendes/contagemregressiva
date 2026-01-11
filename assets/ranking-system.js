// ========================================
// RANKING SYSTEM - Sistema Global de XP
// ========================================

const RankingSystem = {
    STORAGE_KEY: 'stRankingData',
    
    // Sistema de níveis e títulos
    levels: [
        { level: 1, minXP: 0, title: 'Novato', maxXP: 100 },
        { level: 2, minXP: 100, title: 'Iniciante', maxXP: 250 },
        { level: 3, minXP: 250, title: 'Aprendiz', maxXP: 500 },
        { level: 4, minXP: 500, title: 'Dedicado', maxXP: 800 },
        { level: 5, minXP: 800, title: 'Competente', maxXP: 1200 },
        { level: 6, minXP: 1200, title: 'Experiente', maxXP: 1700 },
        { level: 7, minXP: 1700, title: 'Veterano', maxXP: 2300 },
        { level: 8, minXP: 2300, title: 'Expert', maxXP: 3000 },
        { level: 9, minXP: 3000, title: 'Mestre', maxXP: 4000 },
        { level: 10, minXP: 4000, title: 'Lendário', maxXP: Infinity }
    ],

    // Valores de XP para diferentes atividades
    xpValues: {
        quizCorrect: 50,
        quizPerfect: 200,
        quizCombo: 25,
        challengeDay: 100,
        challengeStreak: 50,
        challengeComplete: 500
    },

    // Inicializar sistema
    init() {
        const data = this.getData();
        if (!data.players || data.players.length === 0) {
            this.createDefaultPlayers();
        }
    },

    // Criar jogadores padrão
    createDefaultPlayers() {
        const defaultPlayers = [
            {
                id: 'andressa',
                name: 'Andressa',
                avatar: '👩‍⚕️',
                totalXP: 0,
                quizStats: {
                    gamesPlayed: 0,
                    totalScore: 0,
                    bestScore: 0,
                    perfectGames: 0,
                    bestCombo: 0
                },
                challengeStats: {
                    daysCompleted: 0,
                    currentStreak: 0,
                    bestStreak: 0,
                    completionRate: 0
                },
                achievements: []
            },
            {
                id: 'milena',
                name: 'Milena',
                avatar: '💕',
                totalXP: 0,
                quizStats: {
                    gamesPlayed: 0,
                    totalScore: 0,
                    bestScore: 0,
                    perfectGames: 0,
                    bestCombo: 0
                },
                challengeStats: {
                    daysCompleted: 0,
                    currentStreak: 0,
                    bestStreak: 0,
                    completionRate: 0
                },
                achievements: []
            }
        ];

        this.setData({ players: defaultPlayers });
    },

    // Obter dados do localStorage
    getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : { players: [] };
    },

    // Salvar dados no localStorage
    setData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // Obter jogador por ID
    getPlayer(playerId) {
        const data = this.getData();
        return data.players.find(p => p.id === playerId);
    },

    // Atualizar jogador
    updatePlayer(playerId, updates) {
        const data = this.getData();
        const playerIndex = data.players.findIndex(p => p.id === playerId);
        
        if (playerIndex !== -1) {
            data.players[playerIndex] = {
                ...data.players[playerIndex],
                ...updates
            };
            this.setData(data);
            return data.players[playerIndex];
        }
        return null;
    },

    // Adicionar XP ao jogador
    addXP(playerId, amount, source = 'generic') {
        const player = this.getPlayer(playerId);
        if (!player) return null;

        const newTotalXP = player.totalXP + amount;
        const oldLevel = this.getPlayerLevel(player.totalXP);
        const newLevel = this.getPlayerLevel(newTotalXP);

        const updated = this.updatePlayer(playerId, {
            totalXP: newTotalXP
        });

        // Verificar se subiu de nível
        if (newLevel.level > oldLevel.level) {
            console.log(`🎉 ${player.name} subiu para nível ${newLevel.level}!`);
        }

        return {
            player: updated,
            xpGained: amount,
            leveledUp: newLevel.level > oldLevel.level,
            oldLevel: oldLevel,
            newLevel: newLevel,
            source: source
        };
    },

    // Obter nível do jogador baseado no XP
    getPlayerLevel(xp) {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (xp >= this.levels[i].minXP) {
                return this.levels[i];
            }
        }
        return this.levels[0];
    },

    // Calcular progresso para próximo nível
    getLevelProgress(xp) {
        const currentLevel = this.getPlayerLevel(xp);
        const levelIndex = this.levels.findIndex(l => l.level === currentLevel.level);
        
        if (levelIndex === this.levels.length - 1) {
            return { percentage: 100, current: xp, max: xp };
        }

        const nextLevel = this.levels[levelIndex + 1];
        const currentLevelXP = currentLevel.minXP;
        const nextLevelXP = nextLevel.minXP;
        const progressXP = xp - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        const percentage = Math.min(100, (progressXP / requiredXP) * 100);

        return {
            percentage: percentage,
            current: progressXP,
            max: requiredXP,
            currentLevel: currentLevel,
            nextLevel: nextLevel
        };
    },

    // Atualizar estatísticas do quiz
    updateQuizStats(playerId, stats) {
        const player = this.getPlayer(playerId);
        if (!player) return null;

        const quizStats = {
            gamesPlayed: player.quizStats.gamesPlayed + 1,
            totalScore: player.quizStats.totalScore + stats.score,
            bestScore: Math.max(player.quizStats.bestScore, stats.score),
            perfectGames: player.quizStats.perfectGames + (stats.perfect ? 1 : 0),
            bestCombo: Math.max(player.quizStats.bestCombo, stats.maxCombo)
        };

        return this.updatePlayer(playerId, { quizStats });
    },

    // Atualizar estatísticas do desafio
    updateChallengeStats(playerId, stats) {
        const player = this.getPlayer(playerId);
        if (!player) return null;

        const challengeStats = {
            daysCompleted: stats.daysCompleted || player.challengeStats.daysCompleted,
            currentStreak: stats.currentStreak || player.challengeStats.currentStreak,
            bestStreak: Math.max(
                player.challengeStats.bestStreak,
                stats.currentStreak || 0
            ),
            completionRate: ((stats.daysCompleted || 0) / 15) * 100
        };

        return this.updatePlayer(playerId, { challengeStats });
    },

    // Adicionar conquista
    addAchievement(playerId, achievementId) {
        const player = this.getPlayer(playerId);
        if (!player) return null;

        if (!player.achievements.includes(achievementId)) {
            const achievements = [...player.achievements, achievementId];
            return this.updatePlayer(playerId, { achievements });
        }

        return player;
    },

    // Obter ranking ordenado
    getRanking() {
        const data = this.getData();
        return data.players
            .map(player => ({
                ...player,
                level: this.getPlayerLevel(player.totalXP)
            }))
            .sort((a, b) => b.totalXP - a.totalXP);
    },

    // Obter posição do jogador no ranking
    getPlayerRank(playerId) {
        const ranking = this.getRanking();
        return ranking.findIndex(p => p.id === playerId) + 1;
    },

    // Resetar dados de um jogador específico
    resetPlayer(playerId) {
        const player = this.getPlayer(playerId);
        if (!player) return null;

        return this.updatePlayer(playerId, {
            totalXP: 0,
            quizStats: {
                gamesPlayed: 0,
                totalScore: 0,
                bestScore: 0,
                perfectGames: 0,
                bestCombo: 0
            },
            challengeStats: {
                daysCompleted: 0,
                currentStreak: 0,
                bestStreak: 0,
                completionRate: 0
            },
            achievements: []
        });
    },

    // Resetar todos os dados
    resetAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.createDefaultPlayers();
    }
};

// Inicializar sistema ao carregar
if (typeof window !== 'undefined') {
    window.RankingSystem = RankingSystem;
    RankingSystem.init();
}
