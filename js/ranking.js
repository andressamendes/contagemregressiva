// ==========================================
// STRANGER THINGS COUNTDOWN - RANKING.JS
// Lógica específica da página do Ranking Global
// ==========================================

// Estado do Ranking
const RankingState = {
    rankings: [],
    sortBy: 'score', // score, date, name
    filterBy: 'all' // all, today, week, month
};

// Inicializar Ranking
function initRanking() {
    console.log('🏆 Inicializando Ranking Global...');
    
    // Carregar rankings salvos
    loadRankings();
    
    // Renderizar interface
    renderRanking();
    
    // Configurar filtros
    setupFilters();
}

// Carregar rankings do localStorage
function loadRankings() {
    RankingState.rankings = Utils.loadFromStorage('quizRankings') || [];
    
    // Se não houver rankings, adicionar dados de exemplo
    if (RankingState.rankings.length === 0) {
        addSampleData();
    }
}

// Adicionar dados de exemplo (caso não tenha nenhum ranking)
function addSampleData() {
    const sampleRankings = [
        {
            id: Utils.generateId(),
            name: 'Milena',
            avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milena' },
            score: 170,
            percentage: 100,
            timeSpent: 245,
            date: Date.now() - (1000 * 60 * 60 * 24 * 2), // 2 dias atrás
        },
        {
            id: Utils.generateId(),
            name: 'Andressa',
            avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andressa' },
            score: 150,
            percentage: 88,
            timeSpent: 320,
            date: Date.now() - (1000 * 60 * 60 * 24), // 1 dia atrás
        }
    ];
    
    RankingState.rankings = sampleRankings;
    Utils.saveToStorage('quizRankings', sampleRankings);
}

// Renderizar ranking
function renderRanking() {
    const container = document.getElementById('ranking-container');
    if (!container) return;
    
    // Filtrar e ordenar rankings
    const filteredRankings = filterRankings();
    const sortedRankings = sortRankings(filteredRankings);
    
    // Estatísticas gerais
    const totalPlayers = sortedRankings.length;
    const avgScore = totalPlayers > 0 
        ? Math.round(sortedRankings.reduce((sum, r) => sum + r.score, 0) / totalPlayers)
        : 0;
    const topScore = totalPlayers > 0 ? sortedRankings[0].score : 0;
    
    container.innerHTML = `
        <div class="ranking-header">
            <h2>🏆 Ranking Global</h2>
            
            <div class="ranking-stats">
                <div class="stat-card">
                    <span class="stat-value">${totalPlayers}</span>
                    <span class="stat-label">Jogadores</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${topScore}</span>
                    <span class="stat-label">Top Score</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${avgScore}</span>
                    <span class="stat-label">Média</span>
                </div>
            </div>
        </div>
        
        <div class="ranking-filters">
            <div class="filter-group">
                <label>Ordenar por:</label>
                <select id="sort-select">
                    <option value="score" ${RankingState.sortBy === 'score' ? 'selected' : ''}>Pontuação</option>
                    <option value="date" ${RankingState.sortBy === 'date' ? 'selected' : ''}>Data</option>
                    <option value="name" ${RankingState.sortBy === 'name' ? 'selected' : ''}>Nome</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label>Filtrar por:</label>
                <select id="filter-select">
                    <option value="all" ${RankingState.filterBy === 'all' ? 'selected' : ''}>Todos</option>
                    <option value="today" ${RankingState.filterBy === 'today' ? 'selected' : ''}>Hoje</option>
                    <option value="week" ${RankingState.filterBy === 'week' ? 'selected' : ''}>Esta Semana</option>
                    <option value="month" ${RankingState.filterBy === 'month' ? 'selected' : ''}>Este Mês</option>
                </select>
            </div>
        </div>
        
        <div class="leaderboard">
            ${sortedRankings.length > 0 
                ? sortedRankings.map((ranking, index) => renderRankingItem(ranking, index + 1)).join('')
                : '<p class="no-rankings">Nenhum ranking encontrado. Jogue o quiz para aparecer aqui!</p>'
            }
        </div>
        
        <div class="ranking-actions">
            <button class="btn" onclick="location.href='quiz.html'">Fazer Quiz</button>
            <button class="btn" onclick="clearRankings()">Limpar Rankings</button>
            <button class="back-button" onclick="location.href='index.html'">← Voltar ao Início</button>
        </div>
    `;
}

// Renderizar item individual do ranking
function renderRankingItem(ranking, position) {
    const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '';
    const positionClass = position <= 3 ? 'top-3' : '';
    const date = Utils.formatDate(ranking.date);
    
    return `
        <div class="leaderboard-item ${positionClass}" data-ranking-id="${ranking.id}">
            <div class="ranking-position">
                ${medal || `#${position}`}
            </div>
            
            <img src="${ranking.avatar.url}" alt="${ranking.name}" class="ranking-avatar">
            
            <div class="ranking-info">
                <div class="ranking-name">${ranking.name}</div>
                <div class="ranking-meta">
                    <span>${ranking.percentage}% correto</span>
                    <span>•</span>
                    <span>${ranking.timeSpent}s</span>
                    <span>•</span>
                    <span>${date}</span>
                </div>
            </div>
            
            <div class="ranking-score">${ranking.score} pts</div>
            
            <button class="ranking-delete" onclick="deleteRanking('${ranking.id}')" title="Excluir">
                ✕
            </button>
        </div>
    `;
}

// Configurar filtros
function setupFilters() {
    const sortSelect = document.getElementById('sort-select');
    const filterSelect = document.getElementById('filter-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            RankingState.sortBy = this.value;
            renderRanking();
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            RankingState.filterBy = this.value;
            renderRanking();
        });
    }
}

// Filtrar rankings por data
function filterRankings() {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    switch (RankingState.filterBy) {
        case 'today':
            return RankingState.rankings.filter(r => (now - r.date) < oneDayMs);
        case 'week':
            return RankingState.rankings.filter(r => (now - r.date) < (oneDayMs * 7));
        case 'month':
            return RankingState.rankings.filter(r => (now - r.date) < (oneDayMs * 30));
        default:
            return RankingState.rankings;
    }
}

// Ordenar rankings
function sortRankings(rankings) {
    const sorted = [...rankings];
    
    switch (RankingState.sortBy) {
        case 'score':
            return sorted.sort((a, b) => b.score - a.score);
        case 'date':
            return sorted.sort((a, b) => b.date - a.date);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

// Deletar ranking específico
function deleteRanking(id) {
    if (confirm('Tem certeza que deseja excluir este ranking?')) {
        RankingState.rankings = RankingState.rankings.filter(r => r.id !== id);
        Utils.saveToStorage('quizRankings', RankingState.rankings);
        Toast.success('Ranking excluído!');
        renderRanking();
    }
}

// Limpar todos os rankings
function clearRankings() {
    if (confirm('Tem certeza que deseja limpar TODOS os rankings? Esta ação não pode ser desfeita!')) {
        RankingState.rankings = [];
        Utils.deleteFromStorage('quizRankings');
        Toast.success('Todos os rankings foram limpos!');
        renderRanking();
    }
}

// Exportar rankings (para backup)
function exportRankings() {
    const dataStr = JSON.stringify(RankingState.rankings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `rankings_backup_${Date.now()}.json`;
    link.click();
    
    Toast.success('Rankings exportados com sucesso!');
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRanking);
} else {
    initRanking();
}
