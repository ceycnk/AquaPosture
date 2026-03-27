// app.js - Ana Uygulama Başlatıcısı ve Seans Yönetimi
const app = {
    coins: 0,
    goodPostureSeconds: 0,
    sessionTimer: null,
    timeLeft: 25 * 60,
    isSessionActive: false,
    userData: null,
    
    init: function() {
        console.log("🌊 AquaPosture Başlatılıyor...");
        ui.initBubbles(); // Akvaryum su kabarcığı animasyonlarını çalıştır
        
        // --- KAMERA ---
        const startCamBtn = document.getElementById('start-camera-btn');
        const toggleCamBtn = document.getElementById('toggle-camera-btn');
        
        if(startCamBtn) {
            startCamBtn.addEventListener('click', () => {
                ui.elements.startCameraBtn.textContent = "Kameraya Bağlanıyor...";
                poseManager.init();
                
                poseManager.startCamera().then(success => {
                    if(success) {
                        ui.elements.postureStatus.textContent = "Kamera açık. 3s içinde dik dur...";
                        if(toggleCamBtn) toggleCamBtn.classList.remove('hidden');
                        setTimeout(() => {
                            poseManager.isCalibrated = false; 
                        }, 3000);
                    } else {
                        ui.elements.startCameraBtn.textContent = "Tekrar Dene";
                    }
                });
            });
        }
        
        if (toggleCamBtn) {
            toggleCamBtn.addEventListener('click', () => {
                poseManager.stopCamera();
                ui.showCameraOverlay("Kamera Kapatıldı");
                toggleCamBtn.classList.add('hidden');
                
                if (app.isSessionActive) {
                    app.stopSession();
                    alert("Kamera kapatıldığı için Pomodoro (Odaklanma) Seansı da durduruldu.");
                }
            });
        }
        
        // --- SEANS ---
        const startSessionBtn = document.getElementById('start-session-btn');
        const stopSessionBtn = document.getElementById('stop-session-btn');
        
        if(startSessionBtn) startSessionBtn.addEventListener('click', () => this.startSession());
        if(stopSessionBtn) stopSessionBtn.addEventListener('click', () => this.stopSession());
        
        // --- AUTH ---
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if(loginBtn) loginBtn.addEventListener('click', () => authManager.loginWithGoogle());
        if(logoutBtn) logoutBtn.addEventListener('click', () => authManager.logout());
        
        poseManager.onPostureChange = (isGood) => {
            ui.setPostureState(isGood);
        };
        
        // --- VERITABANI VE AUTH DINLEMESI ---
        authManager.onAuthChange = async (user) => {
            if (user) {
                // UI Güncelleme
                ui.setUserProfile(user.displayName, user.photoURL);
                if(ui.elements.marketBtn) ui.elements.marketBtn.classList.remove('hidden');
                
                // Veritabanı (Firestore) Yükleme
                const data = await dbManager.initUserDoc(user.uid, user.displayName);
                if (data) {
                    app.userData = data;
                    app.coins = data.coins;
                    ui.updateCoins(app.coins);
                    ui.renderAquarium(data.fishes);
                }
            } else {
                // Çıkış Durumu
                ui.setLoginState();
                if(ui.elements.marketBtn) ui.elements.marketBtn.classList.add('hidden');
                app.userData = null;
                app.coins = 0;
                ui.updateCoins(0);
                ui.renderAquarium([]); // Akvaryum balıksız kalır
            }
        };
        
        authManager.init();

        // --- MARKET EVENTLERI ---
        if(ui.elements.marketBtn) {
            ui.elements.marketBtn.addEventListener('click', () => {
                if(app.userData) {
                    ui.renderShop(app.coins, app.userData.fishes);
                    ui.toggleMarket(true);
                }
            });
        }
        
        if(ui.elements.closeMarketBtn) {
            ui.elements.closeMarketBtn.addEventListener('click', () => ui.toggleMarket(false));
        }
        
        // Dinamik Butonlara Tıklama (Event Delegation)
        if(ui.elements.fishShopList) {
            ui.elements.fishShopList.addEventListener('click', async (e) => {
                if (e.target.classList.contains('buy-fish-btn') && !e.target.disabled) {
                    const fishId = e.target.getAttribute('data-id');
                    const fishObj = window.FISH_CATALOG.find(f => f.id === fishId);
                    
                    // Geçici yükleniyor state'i
                    const originalText = e.target.textContent;
                    e.target.textContent = "Satın Alınıyor...";
                    e.target.disabled = true;
                    
                    if (authManager.user && app.userData) {
                        const result = await dbManager.buyFish(
                            authManager.user.uid, 
                            app.userData.fishes, 
                            app.coins, 
                            fishId, 
                            fishObj.cost
                        );
                        if (result.success) {
                            app.coins = result.newTotal;
                            app.userData.fishes = result.newFishes;
                            
                            ui.updateCoins(app.coins);
                            ui.renderShop(app.coins, app.userData.fishes); // Butonları yeniden çiz
                            ui.renderAquarium(app.userData.fishes); // Akvaryumu yenile
                        } else {
                            alert("Satın alma başarısız: " + result.reason);
                            e.target.textContent = originalText;
                            e.target.disabled = false;
                        }
                    }
                }
            });
        }
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
                
                // COIN EKLEME MANTIGI (5 Dakikada 1 Coin = 300 Sn)
                if (poseManager.isCalibrated && poseManager.isGoodPosture) {
                    this.goodPostureSeconds++;
                    
                    if (this.goodPostureSeconds >= 300) {
                        this.coins++;
                        ui.updateCoins(this.coins);
                        this.goodPostureSeconds = 0; // Bir sonraki 5dk için sıfırla
                        
                        // Veritabanını güncelle (Kullanıcı giriş yapmışsa)
                        if (authManager.user && app.userData) {
                             dbManager.updateCoins(authManager.user.uid, this.coins);
                        }
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
