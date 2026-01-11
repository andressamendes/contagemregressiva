// ==========================================
// STRANGER THINGS COUNTDOWN - APP.JS
// JavaScript Global para todas as páginas
// ==========================================

// Configuração Global
const APP_CONFIG = {
    targetDate: new Date('2025-12-31T23:59:59').getTime(),
    theme: {
        primaryColor: '#ff0000',
        backgroundColor: '#000000'
    }
};

// Utilitários Globais
const Utils = {
    // Formatar números com zero à esquerda
    padZero(num) {
        return num < 10 ? '0' + num : num;
    },

    // Salvar dados no localStorage
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
            return false;
        }
    },

    // Carregar dados do localStorage
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Erro ao carregar do localStorage:', e);
            return null;
        }
    },

    // Deletar dados do localStorage
    deleteFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Erro ao deletar do localStorage:', e);
            return false;
        }
    },

    // Gerar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Formatar data para exibição
    formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('pt-BR', options);
    },

    // Vibração (apenas em dispositivos móveis que suportam)
    vibrate(duration = 50) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    },

    // Mostrar elemento com animação
    show(element) {
        if (element) {
            element.classList.remove('hidden');
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.transition = 'opacity 0.3s ease';
                element.style.opacity = '1';
            }, 10);
        }
    },

    // Esconder elemento com animação
    hide(element) {
        if (element) {
            element.style.opacity = '0';
            setTimeout(() => {
                element.classList.add('hidden');
            }, 300);
        }
    },

    // Scroll suave para elemento
    scrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};

// Sistema de Notificações Toast
const Toast = {
    show(message, type = 'info', duration = 3000) {
        // Remove toast anterior se existir
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // Cria novo toast
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            border: 2px solid ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : '#ffcc00'};
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            font-family: 'Benguiat', cursive;
            font-size: 1rem;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Remove após duração
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);

        // Vibração de feedback
        Utils.vibrate(50);
    },

    success(message) {
        this.show(message, 'success');
    },

    error(message) {
        this.show(message, 'error');
    },

    info(message) {
        this.show(message, 'info');
    }
};

// Adiciona estilos de animação do Toast
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .toast-notification {
            right: 10px !important;
            left: 10px !important;
            max-width: calc(100% - 20px) !important;
        }
    }
`;
document.head.appendChild(toastStyles);

// Sistema de Loading
const Loading = {
    show(message = 'Carregando...') {
        // Remove loading anterior se existir
        this.hide();

        const loading = document.createElement('div');
        loading.id = 'app-loading';
        loading.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            ">
                <div class="loading"></div>
                <p style="
                    color: white;
                    font-family: 'Benguiat', cursive;
                    font-size: 1.2rem;
                    margin-top: 20px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                ">${message}</p>
            </div>
        `;
        document.body.appendChild(loading);
    },

    hide() {
        const loading = document.getElementById('app-loading');
        if (loading) {
            loading.remove();
        }
    }
};

// Gerenciador de Eventos (Event Bus)
const EventBus = {
    events: {},

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    },

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
};

// Detectar tipo de dispositivo
const Device = {
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },

    isAndroid() {
        return /Android/i.test(navigator.userAgent);
    },

    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
};

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Log de inicialização
    console.log('🎬 Stranger Things Countdown App Iniciado');
    console.log('📱 Dispositivo:', Device.isMobile() ? 'Mobile' : 'Desktop');
    console.log('📐 Orientação:', Device.getOrientation());

    // Adiciona classe para identificar tipo de dispositivo
    if (Device.isMobile()) {
        document.body.classList.add('mobile-device');
    }

    // Listener para mudanças de orientação
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            console.log('📐 Nova orientação:', Device.getOrientation());
            EventBus.emit('orientationChange', Device.getOrientation());
        }, 100);
    });

    // Listener para redimensionamento
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            EventBus.emit('windowResize', {
                width: window.innerWidth,
                height: window.innerHeight
            });
        }, 250);
    });

    // Previne zoom duplo-toque no iOS
    if (Device.isIOS()) {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
});

// Exporta para uso global
window.APP_CONFIG = APP_CONFIG;
window.Utils = Utils;
window.Toast = Toast;
window.Loading = Loading;
window.EventBus = EventBus;
window.Device = Device;
