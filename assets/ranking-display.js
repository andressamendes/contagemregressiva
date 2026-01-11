// ========================================
// RANKING DISPLAY - Interface do Ranking
// ========================================

const RankingDisplay = {
    init() {
        this.loadRanking();
        this.createParticles();
    },

    loadRanking() {
        if (typeof RankingSystem === 'undefined') {
            console.error('RankingSystem não encontrado!');
            return;
        }

        const ranking = RankingSystem.getRanking();
        
        this.updateStats(ranking);
        this.updatePodium(ranking);
        this.updateTable(ranking);
    },

    updateStats(ranking) {
        const totalPlayers = ranking.length;
        const totalXP = ranking.reduce((sum, player) => sum + player.totalXP, 0);
        const totalAchievements = ranking.reduce((sum, player) => sum + player.achievements.length, 0);

        document.getElementById('total-players').textContent = totalPlayers;
        document.getElementById('total-xp').textContent = totalXP.toLocaleString('pt-BR');
        document.getElementById('total-achievements').textContent = totalAchievements;
    },

    updatePodium(ranking) {
        const podiumContainer = document.getElementById('podium-container');
        podiumContainer.innerHTML = '';

        const medals = ['🥇', '🥈', '🥉'];
        const positions = ['first', 'second', 'third'];

        for (let i = 0; i < Math.min(3, ranking.length); i++) {
            const player = ranking[i];
            const place = document.createElement('div');
            place.className = `podium-place ${positions[i]}`;

            place.innerHTML = `
                <div class="podium-rank">${medals[i]}</div>
                <div class="podium-avatar">${player.avatar}</div>
                <div class="podium-name">${player.name}</div>
                <div class="podium-xp">${player.totalXP.toLocaleString('pt-BR')} XP</div>
                <div class="podium-level">Nível ${player.level.level} - ${player.level.title}</div>
            `;

            podiumContainer.appendChild(place);
        }
    },

    updateTable(ranking) {
        const container = document.getElementById('ranking-table-container');
        
        if (ranking.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🏆</div>
                    <div class="empty-text">Nenhum jogador no ranking ainda!</div>
                </div>
            `;
            return;
        }

        const table = document.createElement('table');
        table.className = 'ranking-table';

        ranking.forEach((player, index) => {
            const row = document.createElement('tr');
            row.className = 'ranking-row';
            
            // Highlight current player (example: Andressa)
            if (player.id === 'andressa') {
                row.classList.add('me');
            }

            const rankNumber = index + 1;
            let rankDisplay = rankNumber;
            
            if (rankNumber === 1) rankDisplay = '🥇';
            else if (rankNumber === 2) rankDisplay = '🥈';
            else if (rankNumber === 3) rankDisplay = '🥉';

            // Get badges
            const badges = this.getPlayerBadges(player);

            row.innerHTML = `
                <td>
                    <div class="rank-number">${rankDisplay}</div>
                </td>
                <td>
                    <div class="player-info">
                        <div class="player-avatar">${player.avatar}</div>
                        <div class="player-details">
                            <div class="player-name">${player.name}</div>
                            <div class="player-title">${player.level.title}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="player-level">Nível ${player.level.level}</div>
                </td>
                <td>
                    <div class="player-xp">${player.totalXP.toLocaleString('pt-BR')}</div>
                </td>
                <td>
                    <div class="player-badges">
                        ${badges}
                    </div>
                </td>
            `;

            table.appendChild(row);
        });

        container.innerHTML = '';
        container.appendChild(table);
    },

    getPlayerBadges(player) {
        const badges = [];

        // Quiz badges
        if (player.quizStats.perfectGames > 0) {
            badges.push('<span class="badge" title="Jogo Perfeito no Quiz">🏆</span>');
        }
        if (player.quizStats.bestCombo >= 10) {
            badges.push('<span class="badge" title="Combo Master">🔥</span>');
        }

        // Challenge badges
        if (player.challengeStats.daysCompleted === 15) {
            badges.push('<span class="badge" title="Desafio Completo">👑</span>');
        }
        if (player.challengeStats.bestStreak >= 7) {
            badges.push('<span class="badge" title="Streak de 7 dias">⚡</span>');
        }

        // Level badges
        if (player.level.level >= 10) {
            badges.push('<span class="badge" title="Nível Máximo">💎</span>');
        } else if (player.level.level >= 7) {
            badges.push('<span class="badge" title="Nível Alto">⭐</span>');
        }

        return badges.length > 0 ? badges.join('') : '<span class="badge">🎮</span>';
    },

    createParticles() {
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
    },

    refresh() {
        this.loadRanking();
    }
};

// ==================== GLOBAL FUNCTIONS ====================
function loadRanking() {
    RankingDisplay.refresh();
}

// ==================== INITIALIZATION ====================
if (typeof window !== 'undefined') {
    window.RankingDisplay = RankingDisplay;
    window.loadRanking = loadRanking;
    
    // Auto-load on page ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            RankingDisplay.init();
        });
    } else {
        RankingDisplay.init();
    }
}
