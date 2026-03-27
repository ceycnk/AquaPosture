// ui.js - Sadece görsel işlemleri yönetir (Modülden Normal JS Objelerine çevrildi)
const ui = {
    elements: {
        timerDisplay: document.getElementById('timer-display'),
        coinCounter: document.getElementById('coin-counter'),
        postureStatus: document.getElementById('posture-status'),
        aquariumBg: document.getElementById('aquarium-bg'),
        cameraOverlay: document.getElementById('camera-overlay'),
        startCameraBtn: document.getElementById('start-camera-btn'),
        toggleCameraBtn: document.getElementById('toggle-camera-btn'),
        inputVideo: document.getElementById('input-video'),
        outputCanvas: document.getElementById('output-canvas'),
        // Auth UI
        loginBtn: document.getElementById('login-btn'),
        userInfo: document.getElementById('user-info'),
        userName: document.getElementById('user-name'),
        userAvatar: document.getElementById('user-avatar'),
        logoutBtn: document.getElementById('logout-btn')
    },
    
    updateTimer: function(timeStr) {
        this.elements.timerDisplay.textContent = timeStr;
    },
    
    updateCoins: function(coins) {
        this.elements.coinCounter.textContent = coins;
    },
    
    setPostureState: function(isGoodPosture) {
        if(isGoodPosture) {
            this.elements.postureStatus.textContent = "✅ Harika, dik duruyorsun!";
            this.elements.postureStatus.className = "font-extrabold text-emerald-600 text-sm transition-colors";
            this.elements.aquariumBg.style.filter = "blur(0px) brightness(1)";
        } else {
            this.elements.postureStatus.textContent = "❌ Duruş bozuk! Lütfen dikleş.";
            this.elements.postureStatus.className = "font-extrabold text-rose-600 text-sm transition-colors animate-pulse";
            this.elements.aquariumBg.style.filter = "blur(8px) brightness(0.7) sepia(0.3)";
        }
    },
    
    showCameraError: function(message) {
        this.elements.cameraOverlay.classList.remove('hidden');
        this.elements.cameraOverlay.innerHTML = `
            <div class="text-rose-400 font-bold mb-2 text-2xl">⚠️ Kamera İzni Gerekli</div>
            <p class="text-sm text-center px-6 text-gray-200">${message}</p>
        `;
    },
    
    hideCameraOverlay: function() {
        this.elements.cameraOverlay.classList.add('hidden');
        this.elements.outputCanvas.style.backgroundColor = 'transparent';
    },

    showCameraOverlay: function(title) {
        this.elements.cameraOverlay.classList.remove('hidden');
        if (title) {
            this.elements.cameraOverlay.querySelector('h3').textContent = title;
        }
        this.elements.startCameraBtn.textContent = "Kamerayı Aç";
        this.elements.postureStatus.textContent = "Bekleniyor...";
        this.elements.postureStatus.className = "font-extrabold text-blue-500 text-sm";
        this.elements.aquariumBg.style.filter = "blur(0px) brightness(1)";
        
        const ctx = this.elements.outputCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.elements.outputCanvas.width, this.elements.outputCanvas.height);
    },
    
    setUserProfile: function(name, photoUrl) {
        this.elements.loginBtn.classList.add('hidden');
        this.elements.userInfo.classList.remove('hidden');
        this.elements.userName.textContent = name;
        this.elements.userAvatar.src = photoUrl || 'https://via.placeholder.com/32';
    },
    
    setLoginState: function() {
        this.elements.loginBtn.classList.remove('hidden');
        this.elements.userInfo.classList.add('hidden');
        this.elements.userName.textContent = "";
        this.elements.userAvatar.src = "";
    }
};
