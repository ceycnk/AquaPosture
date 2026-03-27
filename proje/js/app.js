// app.js - Ana Uygulama Başlatıcısı ve Seans Yönetimi
import { ui } from './ui.js';
import { poseManager } from './pose.js';
import { authManager } from './auth.js';

const app = {
    coins: 0,
    sessionTimer: null,
    timeLeft: 25 * 60, // 25 dakika (Saniye cinsinden)
    isSessionActive: false,
    
    init: function() {
        console.log("🌊 AquaPosture Başlatılıyor...");
        
        // --- Event Listeners (Olay Dinleyicileri) ---
        
        // 1. Kamera Kalibrasyon Butonu
        const startCamBtn = document.getElementById('start-camera-btn');
        if(startCamBtn) {
            startCamBtn.addEventListener('click', () => {
                ui.elements.startCameraBtn.textContent = "Kameraya Bağlanıyor...";
                
                // AI Modelini Başlat
                poseManager.init();
                
                // Kameraya Bağlan ve AI'a Veriyi Yolla
                poseManager.startCamera().then(success => {
                    if(success) {
                        ui.elements.postureStatus.textContent = "Kamera açık. 3s içinde dik dur...";
                        setTimeout(() => {
                            // 3 saniye sonra kalibrasyon değerini sıfırla ki yenisini alsın
                            poseManager.isCalibrated = false; 
                        }, 3000);
                    } else {
                        ui.elements.startCameraBtn.textContent = "Tekrar Dene";
                    }
                });
            });
        }
        
        // 2. Odaklanma Seansı Başlatma Butonu
        const startSessionBtn = document.getElementById('start-session-btn');
        const stopSessionBtn = document.getElementById('stop-session-btn');
        
        if(startSessionBtn) startSessionBtn.addEventListener('click', () => this.startSession());
        if(stopSessionBtn) stopSessionBtn.addEventListener('click', () => this.stopSession());
        
        // 3. Login (Giriş) Butonu
        const loginBtn = document.getElementById('login-btn');
        if(loginBtn) loginBtn.addEventListener('click', () => authManager.loginWithGoogle());
        
        // --- Callbacks (Geri Çağrımlar) ---
        
        // AI Duruş Değişimi Algıladığında
        poseManager.onPostureChange = (isGood) => {
            ui.setPostureState(isGood);
        };
    },
    
    startSession: function() {
        this.isSessionActive = true;
        
        document.getElementById('start-session-btn').classList.add('hidden');
        document.getElementById('stop-session-btn').classList.remove('hidden');
        
        const progressBar = document.getElementById('session-progress');
        const totalDuration = this.timeLeft; // 25 dk

        this.sessionTimer = setInterval(() => {
            if(this.timeLeft > 0) {
                this.timeLeft--;
                this.updateTimeStr();
                
                // Progress Bar Güncellemesi
                const percentage = ((totalDuration - this.timeLeft) / totalDuration) * 100;
                progressBar.style.width = percentage + "%";
                
                // Ekonomi Mantığı: İyi duruyorsan saniyede/veya belli sürede 1 Coin
                if (poseManager.isCalibrated && poseManager.isGoodPosture) {
                    this.coins++;
                    ui.updateCoins(this.coins);
                }
            } else {
                // Zaman Bitti!
                this.stopSession();
                alert("Tebrikler! 25 Dakikalık Odaklanma Seansını Tamamladın!");
            }
        }, 1000); // Her Saniye Tetiklenir
    },
    
    stopSession: function() {
        this.isSessionActive = false;
        clearInterval(this.sessionTimer);
        
        document.getElementById('start-session-btn').classList.remove('hidden');
        document.getElementById('stop-session-btn').classList.add('hidden');
        
        // İsteğe bağlı zamanlayıcıyı sıfırlama (şimdi 25 dkyı geri saralım)
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

// Uygulamayı HTML Yüklendiğinde Başlat
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
