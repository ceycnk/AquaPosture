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
        closeResultBtn: document.getElementById('close-result-btn')
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
    },

    // --- MARKET VE AKVARYUM GÖRSELLERİ ---

    activeTool: null,

    selectTool: function(toolName) {
        // Aynı butona basılıyorsa seçimi iptal et
        if (this.activeTool === toolName) {
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
            // Fare imlecini yem kutusu emojisi yap
            document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\'><text y=\'38\' font-size=\'38\'>🥫</text></svg>") 24 24, auto';
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
            const canAfford = userCoins >= fish.cost;
            
            let btnAction = "";
            if (isOwned) {
                btnAction = `<button disabled class="mt-4 w-full bg-gray-100 text-gray-400 py-2 rounded-lg font-bold border border-gray-200">Sahipsin</button>`;
            } else {
                btnAction = `<button class="buy-fish-btn mt-4 w-full ${canAfford ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} py-2 rounded-lg font-bold transition-all" data-id="${fish.id}" ${canAfford ? '' : 'disabled'}>${fish.cost} 🪙 Satın Al</button>`;
            }

            this.elements.fishShopList.innerHTML += `
                <div class="border border-blue-100 rounded-2xl p-5 flex flex-col items-center shadow-sm relative bg-blue-50/30 hover:bg-white transition-colors">
                    <div class="text-6xl mb-3 drop-shadow-md">${fish.emoji}</div>
                    <h3 class="font-black text-gray-700 text-center leading-tight mb-1">${fish.name}</h3>
                    <div class="text-xs font-semibold text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">${fish.cost === 0 ? 'Hediye' : fish.cost + ' Coin'}</div>
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
            
            // Başlangıç rotası
            el.style.left = Math.floor(Math.random() * 80) + "%";
            el.style.top = Math.floor(Math.random() * 80) + "%";
            
            // Animasyon türleri (Tailwind css bounce ve pulse)
            if(i % 3 === 0) el.classList.add('animate-pulse');
            else if (i % 2 === 0) el.classList.add('animate-bounce');
            
            // Hareket etmelerini sağlamak için basit bir interval
            setInterval(() => {
                el.style.left = Math.floor(Math.random() * 80) + "%";
                el.style.top = Math.floor(Math.random() * 80) + "%";
            }, Math.floor(Math.random() * 4000) + 4000); // 4-8 saniyede bir yer değiştir

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
        const lastCleanStr = localStorage.getItem('lastCleanDate');
        
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
        
        // Eğer fazlaca yeri (mesela 300 parça pixel haraketini) sildiyse; tam temizlenmiş say
        if(this.glassCleanProgress > 250) { 
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
    },
    
    dropFishFood: function(x, y) {
        const bg = this.elements.aquariumBg;
        const food = document.createElement('div');
        food.className = "absolute rounded-full bg-orange-600 z-10 border border-orange-800 pointer-events-none drop-shadow-[0_0_8px_rgba(234,88,12,0.6)]";
        
        // Rastgele minik boyutta tanecikler
        const size = Math.floor(Math.random() * 5) + 6;
        food.style.width = size + "px";
        food.style.height = size + "px";
        food.style.left = (x - size/2) + "px";
        food.style.top = y + "px";
        food.style.transition = "top 3s ease-in, opacity 3s ease-in";
        bg.appendChild(food);
        
        // Tarayıcı çizimi için ufak mini gecikme
        requestAnimationFrame(() => {
            food.style.top = (window.innerHeight + 100) + "px"; 
            food.style.opacity = "0";
        });
        
        setTimeout(() => {
            food.remove();
        }, 3000);
    }
};
