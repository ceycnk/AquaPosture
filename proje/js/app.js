// app.js - Ana Uygulama Başlatıcısı ve Seans Yönetimi
const app = {
    coins: 0,
    goodPostureSeconds: 0,
    sessionTimer: null,
    timeLeft: 25 * 60,
    isSessionActive: false,
    
    init: function() {
        console.log("🌊 AquaPosture Başlatılıyor...");
        
        const startCamBtn = document.getElementById('start-camera-btn');
        if(startCamBtn) {
            startCamBtn.addEventListener('click', () => {
                ui.elements.startCameraBtn.textContent = "Kameraya Bağlanıyor...";
                poseManager.init();
                
                poseManager.startCamera().then(success => {
                    if(success) {
                        ui.elements.postureStatus.textContent = "Kamera açık. 3s içinde dik dur...";
                        setTimeout(() => {
                            poseManager.isCalibrated = false; 
                        }, 3000);
                    } else {
                        ui.elements.startCameraBtn.textContent = "Tekrar Dene";
                    }
                });
            });
        }
        
        const startSessionBtn = document.getElementById('start-session-btn');
        const stopSessionBtn = document.getElementById('stop-session-btn');
        
        if(startSessionBtn) startSessionBtn.addEventListener('click', () => this.startSession());
        if(stopSessionBtn) stopSessionBtn.addEventListener('click', () => this.stopSession());
        
        const loginBtn = document.getElementById('login-btn');
        if(loginBtn) loginBtn.addEventListener('click', () => authManager.loginWithGoogle());
        
        poseManager.onPostureChange = (isGood) => {
            ui.setPostureState(isGood);
        };
    },
    
    startSession: function() {
        this.isSessionActive = true;
        
        document.getElementById('start-session-btn').classList.add('hidden');
        document.getElementById('stop-session-btn').classList.remove('hidden');
        
        const progressBar = document.getElementById('session-progress');
        const totalDuration = this.timeLeft;

        this.sessionTimer = setInterval(() => {
            if(this.timeLeft > 0) {
                this.timeLeft--;
                this.updateTimeStr();
                
                const percentage = ((totalDuration - this.timeLeft) / totalDuration) * 100;
                progressBar.style.width = percentage + "%";
                
                if (poseManager.isCalibrated && poseManager.isGoodPosture) {
                    this.goodPostureSeconds++;
                    // 300 saniye = 5 dakika
                    if (this.goodPostureSeconds >= 300) {
                        this.coins++;
                        ui.updateCoins(this.coins);
                        this.goodPostureSeconds = 0;
                    }
                }
            } else {
                this.stopSession();
                alert("Tebrikler! 25 Dakikalık Odaklanma Seansını Tamamladın!");
            }
        }, 1000);
    },
    
    stopSession: function() {
        this.isSessionActive = false;
        clearInterval(this.sessionTimer);
        
        document.getElementById('start-session-btn').classList.remove('hidden');
        document.getElementById('stop-session-btn').classList.add('hidden');
        
        this.timeLeft = 25 * 60;
        this.updateTimeStr();
        document.getElementById('session-progress').style.width = "0%";
    },
    
    updateTimeStr: function() {
        const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
        const s = (this.timeLeft % 60).toString().padStart(2, '0');
        ui.updateTimer(`${m}:${s}`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
