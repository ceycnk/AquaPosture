// ui.js - Sadece görsel işlemleri yönetir

window.FISH_CATALOG = [
    { id: "clownfish", name: "Palyaço Balığı", emoji: "🐠", cost: 0 },
    { id: "goldfish", name: "Japon Balığı", emoji: "🐟", cost: 5 },
    { id: "pufferfish", name: "Balon Balığı", emoji: "🐡", cost: 15 },
    { id: "shark", name: "Yavru Köpekbalığı", emoji: "🦈", cost: 50 },
    { id: "turtle", name: "Deniz Kaplumbağası", emoji: "🐢", cost: 100 },
    { id: "squid", name: "Mürekkep Balığı", emoji: "🦑", cost: 250 }
];

const ui = {
    isAquariumMode: false,
    isGlassDirty: false,
    glassCleanProgress: 0,
    onGlassCleaned: null,

    elements: {
        uiLayer: document.getElementById('ui-layer'),
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
        logoutBtn: document.getElementById('logout-btn'),
        // Market & Aquarium UI
        viewAquariumBtn: document.getElementById('view-aquarium-btn'),
        exitAquariumBtn: document.getElementById('exit-aquarium-btn'),
        aquariumTools: document.getElementById('aquarium-tools'),
        toolSponge: document.getElementById('tool-sponge'),
        toolFood: document.getElementById('tool-food'),
        marketBtn: document.getElementById('market-btn'),
        marketModal: document.getElementById('market-modal'),
        closeMarketBtn: document.getElementById('close-market-btn'),
        fishShopList: document.getElementById('fish-shop-list'),
        fishContainer: document.getElementById('fish-container'),
        // Session & Result
        timeSelectorContainer: document.getElementById('time-selector-container'),
        timeSelector: document.getElementById('time-selector'),
        resultModal: document.getElementById('result-modal'),
        resultTotalTime: document.getElementById('result-total-time'),
        resultGoodTime: document.getElementById('result-good-time'),
        resultCoins: document.getElementById('result-coins'),
        closeResultBtn: document.getElementById('close-result-btn'),
        // Welcome Onboarding
        welcomeModal: document.getElementById('welcome-modal'),
        welcomeNextBtn: document.getElementById('welcome-next-btn'),
        // Gemini AI
        aiContainer: document.getElementById('ai-motivation-container'),
        aiLoading: document.getElementById('ai-loading-spinner'),
        aiText: document.getElementById('ai-motivation-text')
    },
    
    currentWelcomeStep: 1,

    showWelcomeModal: function() {
        this.currentWelcomeStep = 1;
        this.updateWelcomeUI();
        this.elements.welcomeModal.classList.remove('hidden');
        setTimeout(() => {
            this.elements.welcomeModal.children[0].classList.remove('scale-95');
            this.elements.welcomeModal.children[0].classList.add('scale-100');
        }, 10);
    },

    nextWelcomeStep: function() {
        if (this.currentWelcomeStep < 3) {
            this.currentWelcomeStep++;
            this.updateWelcomeUI();
            return false; // Henüz bitmedi
        } else {
            this.hideWelcomeModal();
            return true; // Bitti
        }
    },

    updateWelcomeUI: function() {
        // Tüm adımları gizle
        document.querySelectorAll('.welcome-step').forEach(el => el.classList.add('hidden'));
        // Aktif adımı göster
        document.getElementById(`welcome-step-${this.currentWelcomeStep}`).classList.remove('hidden');
        
        // Dot'ları güncelle
        for(let i=1; i<=3; i++) {
            const dot = document.getElementById(`welcome-dot-${i}`);
            if(i === this.currentWelcomeStep) {
                dot.classList.replace('bg-gray-300', 'bg-blue-600');
            } else {
                dot.classList.replace('bg-blue-600', 'bg-gray-300');
            }
        }

        // Buton metnini son adımda değiştir
        if(this.currentWelcomeStep === 3) {
            this.elements.welcomeNextBtn.textContent = "Hadi Başlayalım! 🚀";
        } else {
            this.elements.welcomeNextBtn.textContent = "Devam Et →";
        }
    },

    hideWelcomeModal: function() {
        this.elements.welcomeModal.children[0].classList.remove('scale-100');
        this.elements.welcomeModal.children[0].classList.add('scale-95');
        setTimeout(() => {
            this.elements.welcomeModal.classList.add('hidden');
        }, 200);
    },

    // --- Gemini AI Motivasyon Mesajı ---
    showAILoading: function() {
        this.elements.aiContainer.classList.remove('hidden');
        this.elements.aiLoading.classList.remove('hidden');
        this.elements.aiText.textContent = "";
    },

    showAIMessage: function(text) {
        this.elements.aiLoading.classList.add('hidden');
        this.elements.aiText.textContent = `"${text}"`;
        // Hafif bir giriş efekti
        this.elements.aiText.classList.add('animate-in', 'fade-in', 'duration-700');
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
    
    setUserProfile: function(name, photoUrl, userData = null) {
        this.elements.loginBtn.classList.add('hidden');
        this.elements.userInfo.classList.remove('hidden');
        
        // Phase 6: Gösterilecek ismi belirle
        let displayName = name;
        if(userData && userData.username) displayName = `@${userData.username}`;
        
        this.elements.userName.textContent = displayName;
        this.elements.userAvatar.src = photoUrl || 'https://via.placeholder.com/32';
        
        // Phase 6: Streak Rozeti Ekle
        if (userData && userData.streak > 0) {
            let streakBadge = document.getElementById('streak-badge');
            if(!streakBadge) {
                streakBadge = document.createElement('div');
                streakBadge.id = 'streak-badge';
                streakBadge.className = 'ml-2 text-xs font-bold text-orange-600 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1';
                this.elements.userInfo.appendChild(streakBadge);
            }
            streakBadge.innerHTML = `🔥 ${userData.streak} Günlük Seri`;
        } else {
            const streakBadge = document.getElementById('streak-badge');
            if(streakBadge) streakBadge.remove();
        }
    },
    
    setLoginState: function() {
        this.elements.loginBtn.classList.remove('hidden');
        this.elements.userInfo.classList.add('hidden');
        this.elements.userName.textContent = "";
        this.elements.userAvatar.src = "";
    },

    // Phase 7: Gizlilik Yönetimi
    initPrivacyBanner: function() {
        const banner = document.getElementById('privacy-banner');
        const btn = document.getElementById('close-privacy-btn');
        if (!banner || !btn) return;
        
        if (!localStorage.getItem('privacyAccepted')) {
            setTimeout(() => {
                banner.classList.remove('translate-y-[150%]');
            }, 1000); // 1 saniye sonra alttan kayarak çıksın
        }
        
        btn.addEventListener('click', () => {
            localStorage.setItem('privacyAccepted', 'true');
            banner.classList.add('translate-y-[150%]');
            setTimeout(() => banner.remove(), 500);
        });
    },

    // --- MARKET VE AKVARYUM GÖRSELLERİ ---

    activeTool: null,

    selectTool: function(toolName) {
        // Aynı butona basılıyorsa veya araç yoksa seçimi iptal et
        if (!toolName || this.activeTool === toolName) {
            this.activeTool = null;
            this.elements.toolSponge.classList.remove('border-teal-500', 'bg-white');
            this.elements.toolFood.classList.remove('border-teal-500', 'bg-white');
            document.body.style.cursor = 'default';
            return;
        }

        this.activeTool = toolName;
        this.elements.toolSponge.classList.remove('border-teal-500', 'bg-white');
        this.elements.toolFood.classList.remove('border-teal-500', 'bg-white');
        
        if (toolName === 'sponge') {
            this.elements.toolSponge.classList.add('border-teal-500', 'bg-white');
            // Fare imlecini sünger emojisi yap
            document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\'><text y=\'38\' font-size=\'38\'>🧽</text></svg>") 24 24, auto';
        } else if (toolName === 'food') {
            this.elements.toolFood.classList.add('border-teal-500', 'bg-white');
            // Fare imlecini balık yemi emojisi yap
            document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\'><text y=\'38\' font-size=\'38\'>🫘</text></svg>") 24 24, auto';
        } else {
            document.body.style.cursor = 'default';
        }
    },

    toggleAquariumMode: function(isAquariumMode) {
        this.isAquariumMode = isAquariumMode;
        if (isAquariumMode) {
            // Arayüzü gizle, sadece akvaryum kalsın
            this.elements.uiLayer.classList.add('opacity-0', 'scale-110', 'pointer-events-none');
            this.elements.exitAquariumBtn.classList.remove('hidden');
            this.elements.aquariumTools.classList.remove('hidden');
        } else {
            // Arayüzü geri getir
            this.elements.uiLayer.classList.remove('opacity-0', 'scale-110', 'pointer-events-none');
            this.elements.exitAquariumBtn.classList.add('hidden');
            this.elements.aquariumTools.classList.add('hidden');
            this.selectTool(null); // Araç seçimini sıfırla
        }
    },

    toggleMarket: function(show) {
        if(show) {
            this.elements.marketModal.classList.remove('hidden');
            // Kısa bir bekleme ile animasyonu tetikle
            setTimeout(() => {
                this.elements.marketModal.children[0].classList.remove('scale-95');
                this.elements.marketModal.children[0].classList.add('scale-100');
            }, 10);
        } else {
            this.elements.marketModal.children[0].classList.remove('scale-100');
            this.elements.marketModal.children[0].classList.add('scale-95');
            setTimeout(() => {
                this.elements.marketModal.classList.add('hidden');
            }, 200);
        }
    },
    
    showResultModal: function(totalMins, goodSecs, earnedCoins) {
        const goodMins = Math.floor(goodSecs / 60);
        this.elements.resultTotalTime.textContent = totalMins + " Dk";
        this.elements.resultGoodTime.textContent = goodMins + " Dk";
        this.elements.resultCoins.textContent = earnedCoins;
        
        this.elements.resultModal.classList.remove('hidden');
        setTimeout(() => {
            this.elements.resultModal.children[0].classList.remove('scale-95');
            this.elements.resultModal.children[0].classList.add('scale-100');
        }, 10);
    },
    
    hideResultModal: function() {
        this.elements.resultModal.children[0].classList.remove('scale-100');
        this.elements.resultModal.children[0].classList.add('scale-95');
        setTimeout(() => {
            this.elements.resultModal.classList.add('hidden');
        }, 200);
    },

    renderShop: function(userCoins, userFishes) {
        this.elements.fishShopList.innerHTML = '';
        window.FISH_CATALOG.forEach(fish => {
            const isOwned = userFishes.includes(fish.id);
            
            // Phase 4/7: Palyaço balığı hediye olmasına rağmen kaybedilirse cezalı fiyattan (5 coin) alınır.
            let activeCost = fish.cost;
            let costText = activeCost === 0 ? 'Hediye' : activeCost + ' Coin';
            
            if (fish.id === 'clownfish' && !isOwned) {
                activeCost = 5;
                costText = '5 Coin (Ceza)';
            }
            
            const canAfford = userCoins >= activeCost;
            
            let btnAction = "";
            if (isOwned) {
                btnAction = `<button disabled class="mt-4 w-full bg-gray-100 text-gray-400 py-2 rounded-lg font-bold border border-gray-200">Sahipsin</button>`;
            } else {
                btnAction = `<button class="buy-fish-btn mt-4 w-full ${canAfford ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} py-2 rounded-lg font-bold transition-all" data-id="${fish.id}" data-cost="${activeCost}" ${canAfford ? '' : 'disabled'}>${activeCost} 🪙 Satın Al</button>`;
            }

            this.elements.fishShopList.innerHTML += `
                <div class="border border-blue-100 rounded-2xl p-5 flex flex-col items-center shadow-sm relative bg-blue-50/30 hover:bg-white transition-colors">
                    <div class="text-6xl mb-3 drop-shadow-md">${fish.emoji}</div>
                    <h3 class="font-black text-gray-700 text-center leading-tight mb-1">${fish.name}</h3>
                    <div class="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">${costText}</div>
                    ${btnAction}
                </div>
            `;
        });
    },

    renderAquarium: function(userFishes) {
        const container = this.elements.fishContainer;
        container.innerHTML = '';
        
        // Kullanıcının sahip olduğu balıkları bul
        const activeFishes = window.FISH_CATALOG.filter(f => userFishes.includes(f.id));
        
        activeFishes.forEach((fish, i) => {
            const el = document.createElement('div');
            // Balıklara yüzme animasyonu ve rastgele pozisyon veriyoruz (Balıkları devasa gösteriyoruz text-[100px])
            el.className = `absolute text-[80px] md:text-[120px] select-none transition-all duration-[5000ms] ease-in-out drop-shadow-2xl z-20`;
            el.innerHTML = fish.emoji;
            
            el.dataset.eating = "false";
            
            let currentX = Math.floor(Math.random() * 80);
            let currentY = Math.floor(Math.random() * 80);
            el.style.left = currentX + "%";
            el.style.top = currentY + "%";
            
            if(i % 3 === 0) el.classList.add('animate-pulse');
            else if (i % 2 === 0) el.classList.add('animate-bounce');
            
            el.startPatrol = () => {
                el.style.transition = "all 4s ease-in-out"; 
                el.patrolInterval = setInterval(() => {
                    const rect = el.getBoundingClientRect();
                    const rectCenterX = rect.left + rect.width / 2;
                    
                    let nextX = Math.floor(Math.random() * 80);
                    let nextY = Math.floor(Math.random() * 80);
                    const expectedNextPxX = (window.innerWidth * nextX) / 100;
                    
                    if (expectedNextPxX > rectCenterX) {
                        el.style.transform = "scaleX(-1)";
                    } else {
                        el.style.transform = "scaleX(1)";
                    }
                    
                    el.style.left = nextX + "%";
                    el.style.top = nextY + "%";
                }, Math.floor(Math.random() * 4000) + 4000); // 4-8 saniye aralığında gezin
            };

            el.startPatrol();
            container.appendChild(el);
        });
    },

    // Arkaplan su animasyonu
    initBubbles: function() {
        const bg = this.elements.aquariumBg;
        for (let i = 0; i < 20; i++) {
            const bubble = document.createElement('div');
            bubble.className = "fish-bubble";
            const size = Math.floor(Math.random() * 25) + 10 + "px"; // 10px to 35px
            bubble.style.width = size;
            bubble.style.height = size;
            bubble.style.left = Math.floor(Math.random() * 100) + "%";
            bubble.style.animationDuration = (Math.random() * 5 + 4) + "s"; // 4s to 9s
            bubble.style.animationDelay = (Math.random() * 5) + "s";
            bg.appendChild(bubble);
        }
    },
    
    // --- AKVARYUM ETKİLEŞİMLERİ (KİRLİ CAM VE YEM) ---
    
    checkAndInitDirt: function() {
        const todayStr = new Date().toDateString();
        // DEMO & TEST İÇİN HER ZAMAN KİRLİ BAŞLASIN: (Daha sonra || kısmını silebiliriz)
        const lastCleanStr = "TEST"; // localStorage.getItem('lastCleanDate');
        
        // Eğer en son temizlik tarihi bugün değilse (Önceki günse veya ilk girişi ise) cam kirlenir
        if (lastCleanStr !== todayStr) {
            this.isGlassDirty = true;
            this.glassCleanProgress = 0;
            
            const canvas = document.getElementById('dirty-glass');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext('2d');
            
            // Yosun/Pislik Tabanı (Sıvı bulanıklık)
            ctx.fillStyle = 'rgba(30, 80, 40, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Yoğun kirli lekeleri
            for(let i=0; i<300; i++) {
                ctx.beginPath();
                ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*30+10, 0, Math.PI*2);
                ctx.fillStyle = 'rgba(10, 50, 20, 0.3)';
                ctx.fill();
            }
            
            canvas.classList.remove('hidden');
        }
    },
    
    cleanGlass: function(e) {
        if(!this.isGlassDirty) return;
        const canvas = document.getElementById('dirty-glass');
        const ctx = canvas.getContext('2d');
        
        // Fare üstünden geçtikçe silen mod (destination-out)
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        // Sabunla silme boyutunu belirleyen yarıçap
        ctx.arc(e.clientX, e.clientY, 80, 0, Math.PI*2);
        ctx.fill();
        
        this.glassCleanProgress++;
        
        // Gercekci temizleme kontrolu: Acaba cam gercekten silindi mi? (Piksel taramasi)
        // Her 50 silme isleminde bir camdaki piksellerin transparanligina bakalim
        if(this.glassCleanProgress % 50 === 0) { 
            const reqWidth = canvas.width;
            const reqHeight = canvas.height;
            // Tarayici kasmasin diye ufak bir orneklem aliyoruz (genel ekrani kuculterek veya step ile)
            const imgData = ctx.getImageData(0, 0, reqWidth, reqHeight);
            let transparentPixels = 0;
            const step = 40; // Piksel atlama adımı
            let totalChecked = 0;
            
            for (let i = 3; i < imgData.data.length; i += step * 4) {
                // Kenar yumuşatmaları (anti-aliasing) hesaba katarak mutlak 0 yerine < 20 arıyoruz
                if (imgData.data[i] < 20) {
                    transparentPixels++;
                }
                totalChecked++;
            }
            
            const cleanRatio = transparentPixels / totalChecked;
            
            // Tolerans payı eklendi: %85 temizlendiyse temiz say (Kullanıcıyı yormamak için)
            if (cleanRatio > 0.85) {
                this.isGlassDirty = false;
                
                // Yosunu tamamen uçurma ve kaybetme animasyonu
                canvas.style.transition = "opacity 2s ease";
                canvas.style.opacity = "0";
                
                localStorage.setItem('lastCleanDate', new Date().toDateString());
                
                if(this.onGlassCleaned) this.onGlassCleaned();
                
                setTimeout(() => {
                    canvas.classList.add('hidden');
                    canvas.style.transition = "";
                    canvas.style.opacity = "1";
                }, 2000);
            }
        }
    },
    
    dropFishFood: function(x, y) {
        const bg = this.elements.aquariumBg;
        const food = document.createElement('div');
        
        // CSS JIT derleyicisini by-pass eden garantili hardcode Inline Stiller
        food.style.position = "absolute";
        food.style.zIndex = "99999"; 
        food.style.backgroundColor = "#ea580c"; // orange-600
        food.style.border = "2px solid #7c2d12"; // orange-900
        food.style.borderRadius = "50%";
        food.style.pointerEvents = "none";
        food.style.boxShadow = "0 0 10px rgba(234,88,12,0.8)";
        
        const size = Math.floor(Math.random() * 6) + 12; // 12-18px
        food.style.width = size + "px";
        food.style.height = size + "px";
        
        // Yem tam fare tıklandığı X ve Y'den başlasın
        food.style.left = (x - size/2) + "px";
        food.style.top = y + "px"; 
        
        bg.appendChild(food);
        
        const floorY = window.innerHeight + 50; // Ekranın en altı
        
        // Tarayıcı çizimi güvenliği için minik bekleme (Animasyonun atlanmaması için)
        setTimeout(() => {
            food.style.transition = "top 3s linear, opacity 0.5s ease";
            food.style.top = floorY + "px"; 
        }, 50);
        
        // Yemi havada (düşerken 1.5 saniye sonra bulunduğu noktada) yakalama mantığı
        // 3 saniyede floorY'ye varıyorsa; 1.5 saniyede yarısını kat eder.
        const interceptY = y + (floorY - y) * 0.5;
        
        // --- BALIK AI (Yemi Yeme Algoritması) ---
        const fishes = document.querySelectorAll('#fish-container > div');
        let assignedFish = null;
        
        if (fishes.length > 0) {
            // Boşta olan ve şu an yemek yemeyen balıkları bul
            let availableFishes = Array.from(fishes).filter(f => f.dataset.eating !== "true");
            if(availableFishes.length === 0) availableFishes = Array.from(fishes); // Hepsi meşgulse rastgele birini seç
            
            assignedFish = availableFishes[Math.floor(Math.random() * availableFishes.length)];
            assignedFish.dataset.eating = "true";
            
            // Mevcut rastgele yüzmesini durdur
            if (assignedFish.patrolInterval) {
                clearInterval(assignedFish.patrolInterval);
            }
            
            // Balığı yemin duracağı kordinata yüzdür
            setTimeout(() => {
                 const rect = assignedFish.getBoundingClientRect();
                 const currentLeftX = rect.left;
                 
                 // Yemin pozisyonuna göre balığı sağa/sola döndür
                 if (x > currentLeftX) {
                     assignedFish.style.transform = "scaleX(-1)";
                 } else {
                     assignedFish.style.transform = "scaleX(1)";
                 }
                 
                 // Havada Yeme Yetişme Animasyonu (1.4 saniyede yemin o anki tahmini konumuna uçsun)
                 assignedFish.style.transition = "all 1.4s ease-out"; 
                 assignedFish.style.left = (x > currentLeftX ? x - 80 : x - 20) + "px"; // minik ağız payı 
                 assignedFish.style.top = (interceptY - 60) + "px";
            }, 50); // Mermiye koşmaya minik bir gecikmeyle başlasın
        }
        
        // Havada Yemin Midede Kaybolma Anı (Düşüşün 1.5'inci saniyesi, balık o sırada yakalar)
        setTimeout(() => {
            food.style.opacity = "0";
            if (assignedFish) {
                 assignedFish.dataset.eating = "false";
                 if (assignedFish.startPatrol) assignedFish.startPatrol();
            }
            setTimeout(() => food.remove(), 500);
        }, 1500); // 1.5s balık ve yem havada ortada buluşur
    },
    
    // --- SOCIAL LAYER (PHASE 6) ---
    
    initSocialModal: function() {
        // Hedef alan: header'daki buton grupları
        const headerBtnContainer = this.elements.marketBtn ? this.elements.marketBtn.parentElement : null;
        if (!headerBtnContainer) return;

        // Sosyal Butonunu Ekle
        const socialBtn = document.createElement('button');
        socialBtn.id = 'social-btn';
        socialBtn.className = 'hidden relative bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2';
        socialBtn.innerHTML = '👥 Sosyal <span id="social-badge" class="hidden absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 border-2 border-white rounded-full shadow-sm"></span>';
        
        // Market butonundan önceye ekle
        headerBtnContainer.insertBefore(socialBtn, this.elements.marketBtn);
        this.elements.socialBtn = socialBtn;
        
        // Sosyal Modal HTML'i oluştur ve DOM'a ekle
        const modalHtml = `
            <div id="social-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center backdrop-blur-sm transition-all text-gray-800">
                <div class="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl transform scale-95 transition-transform flex flex-col max-h-[90vh]">
                    <div class="flex justify-between items-center border-b pb-4 mb-4 shrink-0">
                        <h2 class="text-2xl font-black text-indigo-800">👥 Sosyal Ağ</h2>
                        <button id="close-social-btn" class="text-gray-400 hover:text-rose-500 text-4xl font-light transition">&times;</button>
                    </div>
                    
                    <div class="flex gap-4 mb-4 shrink-0">
                        <input type="text" id="add-friend-input" placeholder="Arkadaşının @KullanıcıAdı (Örn: john_doe)" class="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-indigo-400">
                        <button id="send-request-btn" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl transition shadow-sm">İstek Gönder</button>
                    </div>

                    <div class="flex-1 overflow-y-hidden grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                        <!-- Liderlik ve Arkadaşlar -->
                        <div class="flex flex-col min-h-0">
                            <h3 class="font-bold text-gray-500 mb-2 uppercase text-xs tracking-wider shrink-0">🏆 Liderlik Tablosu</h3>
                            <div id="leaderboard-list" class="flex flex-col gap-2 mb-6 max-h-32 overflow-y-auto pr-1 shrink-0"></div>
                            
                            <h3 class="font-bold text-gray-500 mb-2 uppercase text-xs tracking-wider shrink-0">🤝 Arkadaşlarım</h3>
                            <div id="friends-list" class="flex flex-col gap-2 overflow-y-auto flex-1 pr-1 pb-2"></div>
                        </div>

                        <!-- Gelen İstekler -->
                        <div class="flex flex-col min-h-0">
                            <h3 class="font-bold text-gray-500 mb-2 uppercase text-xs tracking-wider shrink-0">📩 Gelen İstekler</h3>
                            <div id="requests-list" class="flex flex-col gap-2 bg-indigo-50/50 p-3 rounded-2xl flex-1 overflow-y-auto border border-indigo-100 pr-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        this.elements.socialModal = document.getElementById('social-modal');
        this.elements.closeSocialBtn = document.getElementById('close-social-btn');
        this.elements.addFriendInput = document.getElementById('add-friend-input');
        this.elements.sendRequestBtn = document.getElementById('send-request-btn');
        
        this.elements.leaderboardList = document.getElementById('leaderboard-list');
        this.elements.friendsList = document.getElementById('friends-list');
        this.elements.requestsList = document.getElementById('requests-list');
    },

    toggleSocialModal: function(show) {
        if(show) {
            this.elements.socialModal.classList.remove('hidden');
            setTimeout(() => {
                this.elements.socialModal.children[0].classList.remove('scale-95');
                this.elements.socialModal.children[0].classList.add('scale-100');
            }, 10);
        } else {
            this.elements.socialModal.children[0].classList.remove('scale-100');
            this.elements.socialModal.children[0].classList.add('scale-95');
            setTimeout(() => {
                this.elements.socialModal.classList.add('hidden');
            }, 200);
        }
    },

    updateSocialBadge: function(requestsCount) {
        const badge = document.getElementById('social-badge');
        if (badge) {
            if (requestsCount > 0) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    },

    renderSocialPanel: function(data) {
        // Leaderboard (Liderlik Tablosu)
        this.elements.leaderboardList.innerHTML = '';
        data.leaderboard.forEach((user, index) => {
            let rankEmoji = index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤';
            this.elements.leaderboardList.innerHTML += `
                <div class="flex justify-between items-center bg-gray-50 p-2 px-3 rounded-lg border border-gray-100">
                    <span class="font-bold text-gray-700 font-mono">${rankEmoji} @${user.username} <span class="text-xs text-orange-500 ml-1 font-sans font-black">${user.streak > 0 ? '🔥'+user.streak : ''}</span></span>
                    <span class="font-black text-yellow-500">${user.coins} 🪙</span>
                </div>
            `;
        });

        // Friends (Arkadaşlarım - Sil Butonu)
        this.elements.friendsList.innerHTML = '';
        if (data.friends.length === 0) {
            this.elements.friendsList.innerHTML = `<div class="text-xs text-gray-400 italic">Henüz arkadaşın yok.</div>`;
        } else {
            data.friends.forEach(friend => {
                this.elements.friendsList.innerHTML += `
                    <div class="flex justify-between items-center bg-white p-2 px-3 rounded-lg border border-gray-200 hover:border-rose-200 transition">
                        <span class="font-semibold text-gray-600 font-mono">@${friend.username}</span>
                        <button class="remove-friend-btn text-xs bg-rose-100 hover:bg-rose-500 hover:text-white text-rose-600 font-bold px-2 py-1 rounded transition" data-uid="${friend.uid}">Sil</button>
                    </div>
                `;
            });
        }

        // Requests (İstekler - Kabul Et Butonu)
        this.elements.requestsList.innerHTML = '';
        if (data.friendRequests.length === 0) {
            this.elements.requestsList.innerHTML = `<div class="text-xs text-indigo-400/80 italic text-center mt-4">İstek bulunmuyor.</div>`;
        } else {
            data.friendRequests.forEach(req => {
                this.elements.requestsList.innerHTML += `
                    <div class="flex justify-between items-center bg-white p-2 px-3 rounded-lg border border-indigo-200 shadow-sm">
                        <span class="font-semibold text-indigo-700 font-mono">@${req.username}</span>
                        <button class="accept-request-btn text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded transition shadow-sm" data-uid="${req.uid}">Kabul Et</button>
                    </div>
                `;
            });
        }
    }
};
