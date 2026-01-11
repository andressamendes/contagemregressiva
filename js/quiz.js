// ==========================================
// STRANGER THINGS COUNTDOWN - QUIZ.JS
// Lógica específica da página do Quiz
// ==========================================

// Estado do Quiz
const QuizState = {
    currentQuestion: 0,
    score: 0,
    answers: [],
    startTime: null,
    endTime: null,
    playerName: '',
    selectedAvatar: null
};

// Perguntas do Quiz (17 perguntas originais)
const quizQuestions = [
    {
        question: "Qual é a nossa série favorita?",
        options: ["Stranger Things", "Breaking Bad", "Game of Thrones", "The Office"],
        correct: 0
    },
    {
        question: "Onde nos conhecemos?",
        options: ["Faculdade", "Trabalho", "Festa", "Online"],
        correct: 0
    },
    {
        question: "Qual é o nosso restaurante preferido?",
        options: ["Japonês", "Italiano", "Mexicano", "Brasileiro"],
        correct: 1
    },
    {
        question: "Qual foi nosso primeiro filme juntos?",
        options: ["Vingadores", "Stranger Things (série)", "Interestelar", "La La Land"],
        correct: 1
    },
    {
        question: "Qual é a comida favorita da Milena?",
        options: ["Pizza", "Sushi", "Lasanha", "Hambúrguer"],
        correct: 0
    },
    {
        question: "Qual é o hobby favorito que fazemos juntos?",
        options: ["Cozinhar", "Assistir séries", "Viajar", "Jogar videogame"],
        correct: 1
    },
    {
        question: "Qual é a nossa música especial?",
        options: ["Perfect - Ed Sheeran", "Shallow - Lady Gaga", "All of Me - John Legend", "Photograph - Ed Sheeran"],
        correct: 0
    },
    {
        question: "Qual é o apelido carinhoso que eu te dou?",
        options: ["Amor", "Princesa", "Meu bem", "Vida"],
        correct: 1
    },
    {
        question: "Qual é o nosso plano para o futuro?",
        options: ["Viajar o mundo", "Ter filhos", "Comprar uma casa", "Todas as anteriores"],
        correct: 3
    },
    {
        question: "Qual é a cor favorita da Milena?",
        options: ["Azul", "Rosa", "Roxo", "Vermelho"],
        correct: 2
    },
    {
        question: "Qual é o personagem favorito de Stranger Things da Milena?",
        options: ["Eleven", "Mike", "Dustin", "Steve"],
        correct: 0
    },
    {
        question: "Qual é o nosso destino de viagem dos sonhos?",
        options: ["Paris", "Japão", "Nova York", "Grécia"],
        correct: 1
    },
    {
        question: "Qual é a nossa sobremesa favorita?",
        options: ["Sorvete", "Bolo de chocolate", "Pudim", "Brownie"],
        correct: 3
    },
    {
        question: "Qual é o dia mais especial para nós?",
        options: ["Aniversário de namoro", "Natal", "Ano Novo", "Dia dos Namorados"],
        correct: 0
    },
    {
        question: "Qual é o animal de estimação que queremos ter?",
        options: ["Cachorro", "Gato", "Coelho", "Papagaio"],
        correct: 0
    },
    {
        question: "Qual é a nossa bebida favorita para compartilhar?",
        options: ["Vinho", "Cerveja", "Refrigerante", "Suco"],
        correct: 0
    },
    {
        question: "Qual é a frase que mais representa nosso relacionamento?",
        options: [
            "Amor verdadeiro nunca morre",
            "Juntos somos mais fortes",
            "Você é meu mundo",
            "Para sempre ao seu lado"
        ],
        correct: 1
    }
];

// Avatares disponíveis (SVG API)
const avatarOptions = [
    { id: 1, name: "Beam", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milena1" },
    { id: 2, name: "Pixel", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milena2" },
    { id: 3, name: "Adventurer", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milena3" },
    { id: 4, name: "Bottts", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milena4" }
];

// Inicializar Quiz
function initQuiz() {
    console.log('🎮 Inicializando Quiz...');
    
    // Resetar estado
    QuizState.currentQuestion = 0;
    QuizState.score = 0;
    QuizState.answers = [];
    QuizState.startTime = Date.now();
    
    // Carregar nome e avatar salvos
    const savedData = Utils.loadFromStorage('quizPlayer');
    if (savedData) {
        QuizState.playerName = savedData.name;
        QuizState.selectedAvatar = savedData.avatar;
    }
    
    // Renderizar tela inicial ou pergunta
    if (!QuizState.playerName || !QuizState.selectedAvatar) {
        showAvatarSelection();
    } else {
        showQuestion();
    }
}

// Mostrar seleção de avatar
function showAvatarSelection() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="avatar-selection">
            <h2>Escolha seu Avatar</h2>
            <div class="avatar-grid">
                ${avatarOptions.map(avatar => `
                    <div class="avatar-option" data-avatar-id="${avatar.id}">
                        <img src="${avatar.url}" alt="${avatar.name}" class="avatar-preview">
                    </div>
                `).join('')}
            </div>
            <input type="text" id="player-name" placeholder="Digite seu nome" maxlength="20">
            <button id="start-quiz-btn" disabled>Começar Quiz</button>
        </div>
    `;
    
    // Adicionar eventos
    const avatarOptionsElements = document.querySelectorAll('.avatar-option');
    const nameInput = document.getElementById('player-name');
    const startBtn = document.getElementById('start-quiz-btn');
    
    avatarOptionsElements.forEach(option => {
        option.addEventListener('click', function() {
            avatarOptionsElements.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            QuizState.selectedAvatar = avatarOptions.find(a => a.id == this.dataset.avatarId);
            checkCanStart();
        });
    });
    
    nameInput.addEventListener('input', function() {
        QuizState.playerName = this.value.trim();
        checkCanStart();
    });
    
    startBtn.addEventListener('click', startQuiz);
    
    function checkCanStart() {
        startBtn.disabled = !(QuizState.playerName && QuizState.selectedAvatar);
    }
}

// Iniciar Quiz
function startQuiz() {
    // Salvar dados do jogador
    Utils.saveToStorage('quizPlayer', {
        name: QuizState.playerName,
        avatar: QuizState.selectedAvatar
    });
    
    QuizState.startTime = Date.now();
    Toast.success(`Boa sorte, ${QuizState.playerName}!`);
    Utils.vibrate(100);
    
    showQuestion();
}

// Mostrar pergunta atual
function showQuestion() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
    const question = quizQuestions[QuizState.currentQuestion];
    const progress = ((QuizState.currentQuestion + 1) / quizQuestions.length) * 100;
    
    container.innerHTML = `
        <div class="quiz-question-container">
            <div class="quiz-header">
                <img src="${QuizState.selectedAvatar.url}" alt="Avatar" class="avatar">
                <div class="quiz-info">
                    <p class="player-name">${QuizState.playerName}</p>
                    <p class="quiz-score">Pontuação: ${QuizState.score}</p>
                </div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            
            <p class="question-number">Pergunta ${QuizState.currentQuestion + 1} de ${quizQuestions.length}</p>
            
            <h3 class="question-text">${question.question}</h3>
            
            <div class="options-grid">
                ${question.options.map((option, index) => `
                    <div class="option" data-index="${index}">
                        ${option}
                    </div>
                `).join('')}
            </div>
            
            <button class="back-button" onclick="goBack()">← Voltar</button>
        </div>
    `;
    
    // Adicionar eventos às opções
    const options = container.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            selectAnswer(parseInt(this.dataset.index));
        });
    });
}

// Selecionar resposta
function selectAnswer(selectedIndex) {
    const question = quizQuestions[QuizState.currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    
    // Feedback visual
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.style.pointerEvents = 'none';
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Atualizar pontuação
    if (isCorrect) {
        QuizState.score += 10;
        Toast.success('Resposta correta! +10 pontos');
        Utils.vibrate(100);
    } else {
        Toast.error('Resposta incorreta!');
        Utils.vibrate([100, 50, 100]);
    }
    
    // Salvar resposta
    QuizState.answers.push({
        question: question.question,
        selected: selectedIndex,
        correct: question.correct,
        isCorrect: isCorrect
    });
    
    // Próxima pergunta ou finalizar
    setTimeout(() => {
        QuizState.currentQuestion++;
        if (QuizState.currentQuestion < quizQuestions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 1500);
}

// Finalizar Quiz
function finishQuiz() {
    QuizState.endTime = Date.now();
    const timeSpent = Math.floor((QuizState.endTime - QuizState.startTime) / 1000);
    const percentage = Math.round((QuizState.score / (quizQuestions.length * 10)) * 100);
    
    // Salvar resultado
    const result = {
        id: Utils.generateId(),
        name: QuizState.playerName,
        avatar: QuizState.selectedAvatar,
        score: QuizState.score,
        percentage: percentage,
        timeSpent: timeSpent,
        date: Date.now(),
        answers: QuizState.answers
    };
    
    // Salvar no ranking
    let rankings = Utils.loadFromStorage('quizRankings') || [];
    rankings.push(result);
    rankings.sort((a, b) => b.score - a.score);
    Utils.saveToStorage('quizRankings', rankings);
    
    // Mostrar resultado
    showResult(result);
}

// Mostrar resultado final
function showResult(result) {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
    let message = '';
    if (result.percentage >= 90) {
        message = '🏆 PERFEITO! Você conhece tudo sobre nós!';
    } else if (result.percentage >= 70) {
        message = '🎉 MUITO BOM! Você conhece bem nossa história!';
    } else if (result.percentage >= 50) {
        message = '👍 BOM! Mas ainda tem muito para aprender!';
    } else {
        message = '📚 Precisa estudar mais sobre nós!';
    }
    
    container.innerHTML = `
        <div class="quiz-result">
            <h2>Quiz Finalizado!</h2>
            
            <div class="result-avatar">
                <img src="${result.avatar.url}" alt="Avatar" class="avatar">
            </div>
            
            <h3>${result.name}</h3>
            
            <div class="result-stats">
                <div class="stat">
                    <span class="stat-value">${result.score}</span>
                    <span class="stat-label">Pontos</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${result.percentage}%</span>
                    <span class="stat-label">Acertos</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${result.timeSpent}s</span>
                    <span class="stat-label">Tempo</span>
                </div>
            </div>
            
            <p class="result-message">${message}</p>
            
            <div class="result-actions">
                <button onclick="location.href='ranking.html'">Ver Ranking</button>
                <button onclick="location.reload()">Jogar Novamente</button>
                <button class="back-button" onclick="location.href='index.html'">← Voltar ao Início</button>
            </div>
        </div>
    `;
    
    Toast.success('Resultado salvo no ranking!');
    Utils.vibrate(200);
}

// Função global para voltar
function goBack() {
    if (confirm('Tem certeza que deseja sair do quiz? Seu progresso será perdido.')) {
        window.location.href = 'index.html';
    }
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
