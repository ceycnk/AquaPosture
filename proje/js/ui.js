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
        logoutBtn: document.getElementById('logout-btn'),
        // Market UI
        marketBtn: document.getElementById('market-btn'),
        marketModal: document.getElementById('market-modal'),
        closeMarketBtn: document.getElementById('close-market-btn'),
        fishShopList: document.getElementById('fish-shop-list'),
        fishContainer: document.getElementById('fish-container')
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
    }
};
