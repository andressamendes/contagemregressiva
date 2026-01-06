❤️ Contagem Regressiva

Uma página web romântica, interativa e totalmente otimizada para dispositivos móveis, criada para surpreender alguém especial com uma contagem regressiva para um encontro inesquecível.

✨ Funcionalidades

Contagem Regressiva: Um cronômetro elegante contando os dias, horas, minutos e segundos até a data do encontro.

Contador de História: Um segundo contador mostrando o tempo desde um marco importante (ex: primeiro beijo).

Música de Fundo: Integração com YouTube API para tocar uma música especial automaticamente (com truques para funcionar em mobile).

Interações Divertidas:

Botão da Verdade: Um quiz "Você me ama?" onde o botão "Não" foge do cursor/dedo.

Segredos: Um botão que revela frases de amor aleatórias.

Carta Digital: Um envelope flutuante que abre uma mensagem carinhosa.

Visual Imersivo:

Efeito de "Glassmorphism" (vidro fosco).

Animações de entrada suaves.

Partículas flutuantes (vagalumes) e corações.

Background gradiente animado.

100% Responsivo: Otimizado para funcionar perfeitamente em qualquer tamanho de tela, especialmente celulares (iPhone, Android).

🚀 Como Usar

1. Pré-requisitos

Você não precisa instalar nada! O projeto usa HTML, CSS e JavaScript puro, com Tailwind CSS carregado via CDN. Basta ter um editor de texto (como VS Code ou Bloco de Notas).

2. Configuração Básica

Abra o arquivo index.html e procure pela seção <script> no final do arquivo para alterar as configurações principais:

// --- CONFIGURAÇÕES ---
const targetDate = new Date("2026-01-26T20:00:00").getTime(); // Data do Encontro
const firstKissDate = new Date("2025-09-07T23:00:00").getTime(); // Data do Passado
const mainPhrase = "A gente se escolhe todo dia"; // Frase digitada na tela


3. Personalizando a Música

Para mudar a música de fundo, encontre a função onYouTubeIframeAPIReady e troque o videoId pelo ID do vídeo do YouTube que você deseja (a parte depois de v= no link).

player = new YT.Player('youtube-player', {
    videoId: 'nbZTVUduKBY', // Coloque o ID aqui
    // ...
});


Dica: Para o efeito de fade-in (aumento gradual do volume) funcionar bem, escolha um vídeo que não tenha uma introdução muito silenciosa.

🌐 Como Hospedar no GitHub Pages

Para que a surpresa fique online e acessível pelo celular:

Crie um repositório no GitHub.

Faça o upload do arquivo principal. Importante: Renomeie o arquivo para index.html.

Vá em Settings (Configurações) > Pages (na barra lateral esquerda).

Em Source, selecione a branch main (ou master) e salve.

Aguarde alguns minutos e o GitHub fornecerá o link do seu site (ex: https://seu-usuario.github.io/nome-do-repo/).

📱 Dica para Mobile

Navegadores de celular bloqueiam áudio automático por padrão. Este projeto possui uma Tela de Entrada ("Toque para ouvir nossa música") que serve como um gatilho para desbloquear o áudio assim que a pessoa toca na tela.

🛠️ Tecnologias

HTML5

JavaScript (Vanilla)

Tailwind CSS (CDN)

YouTube IFrame API

Google Fonts (Montserrat, Great Vibes, Cormorant Garamond)

Feito com ❤️ para celebrar o amor.
