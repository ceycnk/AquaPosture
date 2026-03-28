// app.js - Ana Uygulama Başlatıcısı ve Seans Yönetimi
const app = {
    coins: 0,
    sessionGoodPostureSeconds: 0,
    sessionTargetMinutes: 25,
    sessionTimer: null,
    timeLeft: 25 * 60,
    isSessionActive: false,
    userData: null,
    didNotifySlouch: false,
    alertAudio: new Audio("https://cdn.freesound.org/previews/254/254818_4597795-lq.mp3"),
    successAudio: new Audio("https://cdn.freesound.org/previews/171/171671_2437358-lq.mp3"),

    init: function () {
        console.log("🌊 AquaPosture Başlatılıyor...");
        ui.initBubbles(); // Akvaryum su kabarcığı animasyonlarını çalıştır

        // Akvaryum cam kirliliğini kontrol edip yükle
        ui.checkAndInitDirt();

        // Onboarding (Hoşgeldin) Kontrolü
        if (!localStorage.getItem('hasSeenWelcome')) {
            ui.showWelcomeModal();
        }

        ui.onGlassCleaned = () => {
            alert("✨ Harika, Akvaryum Camlarını Tertemiz Yaptın!");
        };

        // Fare hareketini küresel olarak yakala ve moduna göre Yemleme/Temizleme yap
        document.addEventListener('mousemove', (e) => {
            if (!ui.isAquariumMode || !ui.activeTool) return; // Araç seçili değilse işlem yapma

            if (ui.activeTool === 'sponge' && ui.isGlassDirty) {
                // Sadece Sünger seçiliyken ve cam kirliyken temizle
                ui.cleanGlass(e);
            }
        });

        // Tıklama Eylemi: Sadece Yem seçiliyken çalışır
        document.addEventListener('click', (e) => {
            if (!ui.isAquariumMode || ui.activeTool !== 'food') return;
            // Menülere tıklamayı engelle
            if (e.target.closest('#aquarium-tools') || e.target.closest('#exit-aquarium-btn')) return;

            ui.dropFishFood(e.clientX, e.clientY);
        });

        // --- KAMERA ---
        const startCamBtn = document.getElementById('start-camera-btn');
        const toggleCamBtn = document.getElementById('toggle-camera-btn');

        if (startCamBtn) {
            startCamBtn.addEventListener('click', () => {
                ui.elements.startCameraBtn.textContent = "Kameraya Bağlanıyor...";
                poseManager.init();

                poseManager.startCamera().then(success => {
                    if (success) {
                        ui.elements.postureStatus.textContent = "Kamera açık. 3s içinde dik dur...";
                        if (toggleCamBtn) toggleCamBtn.classList.remove('hidden');
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

        if (startSessionBtn) startSessionBtn.addEventListener('click', () => this.startSession());
        if (stopSessionBtn) stopSessionBtn.addEventListener('click', () => this.stopSession());

        // --- WELCOME ONBOARDING ---
        if (ui.elements.welcomeNextBtn) {
            ui.elements.welcomeNextBtn.addEventListener('click', () => {
                const isFinished = ui.nextWelcomeStep();
                if (isFinished) {
                    localStorage.setItem('hasSeenWelcome', 'true');
                    this.requestPermissions();
                }
            });
        }

        // --- AUTH ---
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (loginBtn) loginBtn.addEventListener('click', () => authManager.loginWithGoogle());
        if (logoutBtn) logoutBtn.addEventListener('click', () => authManager.logout());

        poseManager.onPostureChange = (isGood) => {
            ui.setPostureState(isGood);

            // Arka Plan Uyarı Sistemi 
            if (document.visibilityState === 'hidden' && app.isSessionActive) {
                if (!isGood && !app.didNotifySlouch) {
                    app.didNotifySlouch = true;

                    // 1. Sekme Titretme
                    let isAlertTitle = false;
                    app.alertInterval = setInterval(() => {
                        document.title = isAlertTitle ? "⚠️ DİK DUR!" : "🌊 AquaPosture";
                        isAlertTitle = !isAlertTitle;
                    }, 1000);

                    // 2. Sesli Bip Uyarı
                    try {
                        this.alertAudio.currentTime = 0;
                        this.alertAudio.volume = 0.6;
                        this.alertAudio.play().catch(e => console.log("Ses çalma engellendi (Muhtemelen etkileşim eksikliği):", e));
                    } catch (err) { }

                    // 3. Masaüstü Bildirimi
                    if ("Notification" in window && Notification.permission === "granted") {
                        try {
                            const n = new Notification("AquaPosture | Kambur Duruyorsun! ⚠️", {
                                body: "Arka planda çalışırken duruşunun bozulduğunu fark ettik. Lütfen dik oturun.",
                                icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                                requireInteraction: true
                            });
                            n.onclick = () => window.focus();
                            console.log("Bildirim başarıyla gönderildi.");
                        } catch (err) {
                            console.error("Bildirim gönderilemedi (Tarayıcı veya İşletim Sistemi engeli olabilir):", err);
                        }
                    } else {
                        console.log("Bildirim izni yok veya desteklenmiyor.");
                    }
                } else if (isGood && app.didNotifySlouch) {
                    // Duruş düzeldiğinde
                    app.clearAlerts();
                }
            } else if (document.visibilityState === 'visible') {
                app.clearAlerts();
            }
        };

        // Sayfa tekrar görünür olduğunda uyarıları temizle
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'visible') {
                app.clearAlerts();
            }
        });

        // --- VERITABANI VE AUTH DINLEMESI ---
        authManager.onAuthChange = async (user) => {
            if (user) {
                if (ui.elements.marketBtn) ui.elements.marketBtn.classList.remove('hidden');
                if (ui.elements.viewAquariumBtn) ui.elements.viewAquariumBtn.classList.remove('hidden');
                if (ui.elements.socialBtn) ui.elements.socialBtn.classList.remove('hidden'); // Sosyal Button
                if (ui.elements.weeklyReportBtn) ui.elements.weeklyReportBtn.classList.remove('hidden'); // Rapor Button

                // Veritabanı (Firestore) Yükleme
                let data = await dbManager.initUserDoc(user.uid, user.displayName);
                if (data) {
                    // Phase 6: Kullanıcı adı kontrolü - Benzersizlik Eklendi
                    if (!data.username) {
                        let isSaved = false;
                        while (!isSaved) {
                            const chosenName = prompt("AquaPosture'a Hoşgeldin! Arkadaşlarının seni bulabilmesi için lütfen benzersiz bir Kullanıcı Adı belirle (Örn: yuzucu99):");
                            let targetName = "";
                            if (chosenName && chosenName.trim() !== "") {
                                targetName = chosenName.trim();
                            } else {
                                targetName = "user_" + Math.floor(Math.random() * 1000000);
                            }

                            const res = await dbManager.updateUsername(user.uid, targetName);
                            if (res.success) {
                                data.username = targetName;
                                isSaved = true;
                            } else {
                                alert("Kayit başarisiz: " + res.reason + " Lütfen farklı bir isim deneyin.");
                            }
                        }
                    }

                    // UI Güncelleme
                    ui.setUserProfile(user.displayName, user.photoURL, data);

                    if (data.friendRequestsIn) {
                        ui.updateSocialBadge(data.friendRequestsIn.length);
                    }

                    app.userData = data;
                    app.coins = data.coins;
                    ui.updateCoins(app.coins);
                    ui.renderAquarium(data.fishes);
                }
            } else {
                // Çıkış Durumu
                ui.setLoginState();
                if (ui.elements.marketBtn) ui.elements.marketBtn.classList.add('hidden');
                if (ui.elements.viewAquariumBtn) ui.elements.viewAquariumBtn.classList.add('hidden');
                if (ui.elements.socialBtn) ui.elements.socialBtn.classList.add('hidden');
                if (ui.elements.weeklyReportBtn) ui.elements.weeklyReportBtn.classList.add('hidden');
                app.userData = null;
                app.coins = 0;
                ui.updateCoins(0);
                ui.renderAquarium([]); // Akvaryum balıksız kalır
            }
        };

        authManager.init();

        // --- AKVARYUM VE MARKET EVENTLERI ---
        if (ui.elements.viewAquariumBtn) {
            ui.elements.viewAquariumBtn.addEventListener('click', () => ui.toggleAquariumMode(true));
        }
        if (ui.elements.exitAquariumBtn) {
            ui.elements.exitAquariumBtn.addEventListener('click', () => ui.toggleAquariumMode(false));
        }
        if (ui.elements.toolSponge) {
            ui.elements.toolSponge.addEventListener('click', () => ui.selectTool('sponge'));
        }
        if (ui.elements.toolFood) {
            ui.elements.toolFood.addEventListener('click', () => ui.selectTool('food'));
        }

        if (ui.elements.marketBtn) {
            ui.elements.marketBtn.addEventListener('click', () => {
                if (app.userData) {
                    ui.renderShop(app.coins, app.userData.fishes);
                    ui.toggleMarket(true);
                }
            });
        }

        if (ui.elements.closeMarketBtn) {
            ui.elements.closeMarketBtn.addEventListener('click', () => ui.toggleMarket(false));
        }

        // Dinamik Butonlara Tıklama (Event Delegation)
        if (ui.elements.fishShopList) {
            ui.elements.fishShopList.addEventListener('click', async (e) => {
                if (e.target.classList.contains('buy-fish-btn') && !e.target.disabled) {
                    const fishId = e.target.getAttribute('data-id');
                    const fishObj = window.FISH_CATALOG.find(f => f.id === fishId);

                    // Geçici yükleniyor state'i
                    const originalText = e.target.textContent;
                    e.target.textContent = "Satın Alınıyor...";
                    e.target.disabled = true;

                    if (window.auth.currentUser && app.userData) {
                            const fishCost = parseInt(e.target.getAttribute('data-cost') || 0);

                            const result = await dbManager.buyFish(
                                window.auth.currentUser.uid,
                                app.userData.fishes,
                                app.coins,
                                fishId,
                                fishCost
                            );
                        if (result.success) {
                            app.coins = result.newTotal;
                            app.userData.coins = result.newTotal; // Sync userData
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

        // --- SOCIAL LAYER (PHASE 6) DINLEYICILERI ---
        ui.initSocialModal();
        if (ui.elements.socialBtn) {
            ui.elements.socialBtn.addEventListener('click', async () => {
                if (window.auth.currentUser && app.userData) {
                    const socialData = await dbManager.getSocialData(window.auth.currentUser.uid, app.userData);
                    ui.renderSocialPanel(socialData);
                    ui.toggleSocialModal(true);
                }
            });
        }
        if (ui.elements.closeSocialBtn) {
            ui.elements.closeSocialBtn.addEventListener('click', () => ui.toggleSocialModal(false));
        }

        // --- WEEKLY REPORT EVENTS ---
        ui.initWeeklyReportModal();
        if (ui.elements.weeklyReportBtn) {
            ui.elements.weeklyReportBtn.addEventListener('click', async () => {
                ui.toggleWeeklyReportModal(true);
                ui.showWeeklyReportLoading();
                if (window.auth.currentUser) {
                    await geminiManager.generateWeeklyReport(window.auth.currentUser.uid);
                }
            });
        }
        if (ui.elements.closeWeeklyReportBtn) {
            ui.elements.closeWeeklyReportBtn.addEventListener('click', () => ui.toggleWeeklyReportModal(false));
        }

        if (ui.elements.sendRequestBtn) {
            ui.elements.sendRequestBtn.addEventListener('click', async () => {
                const target = ui.elements.addFriendInput.value.trim().replace('@', '');
                if (!target) return alert("Kullanıcı adı giriniz!");

                ui.elements.sendRequestBtn.textContent = "...";
                const res = await dbManager.sendFriendRequest(window.auth.currentUser.uid, target);
                ui.elements.sendRequestBtn.textContent = "İstek Gönder";

                if (res.success) {
                    alert("İstek gönderildi!");
                    ui.elements.addFriendInput.value = "";
                } else {
                    alert("Hata: " + res.reason);
                }
            });
        }

        // Sosyal Butonlara (Kabul Et / Sil) Genel Tıklama Yakalayıcı (Event Delegation)
        document.body.addEventListener('click', async (e) => {
            // Arkadaş İstek Kabul Et
            if (e.target.classList.contains('accept-request-btn')) {
                const reqUid = e.target.getAttribute('data-uid');
                const btn = e.target;
                btn.disabled = true;
                btn.textContent = "...";

                const success = await dbManager.acceptFriendRequest(window.auth.currentUser.uid, reqUid);
                if (success) {
                    if (!app.userData.friends) app.userData.friends = [];
                    app.userData.friends.push(reqUid);
                    app.userData.friendRequestsIn = (app.userData.friendRequestsIn || []).filter(id => id !== reqUid);

                    ui.updateSocialBadge(app.userData.friendRequestsIn.length);

                    const socialData = await dbManager.getSocialData(window.auth.currentUser.uid, app.userData);
                    ui.renderSocialPanel(socialData);
                } else {
                    alert("Kabul işlemi başarısız.");
                    btn.disabled = false;
                    btn.textContent = "Kabul Et";
                }
            }
            // Arkadaş Sil (Senkron)
            else if (e.target.classList.contains('remove-friend-btn')) {
                const friendUid = e.target.getAttribute('data-uid');
                if (!confirm("Bu arkadaşınızı listeden çıkarmak istediğinize emin misiniz?")) return;

                const btn = e.target;
                btn.disabled = true;
                btn.textContent = "...";

                const success = await dbManager.removeFriend(window.auth.currentUser.uid, friendUid);
                if (success) {
                    app.userData.friends = (app.userData.friends || []).filter(id => id !== friendUid);
                    const socialData = await dbManager.getSocialData(window.auth.currentUser.uid, app.userData);
                    ui.renderSocialPanel(socialData);
                } else {
                    alert("Arkadaş silme başarısız.");
                    btn.disabled = false;
                    btn.textContent = "Sil";
                }
            }
        });

        // --- SÜRE VE SONUÇ ---
        if (ui.elements.timeSelector) {
            ui.elements.timeSelector.addEventListener('change', (e) => {
                if (!app.isSessionActive) {
                    app.timeLeft = parseInt(e.target.value) * 60;
                    app.updateTimeStr();
                }
            });
            // Sayfa açılışında seçili değere göre süreyi yaz
            app.timeLeft = parseInt(ui.elements.timeSelector.value) * 60;
            app.updateTimeStr();
        }

        if (ui.elements.closeResultBtn) {
            ui.elements.closeResultBtn.addEventListener('click', () => {
                ui.hideResultModal();
            });
        }

        // Phase 7: Gizlilik Banner Başlatıcı
        ui.initPrivacyBanner();
    },

    startSession: function () {
        // İzinleri Kontrol Et: Bildirim
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }

        // Kamera açık değilse veya kalibrasyon yapılmamışsa uyarı ver
        if (!poseManager || !poseManager.isCalibrated) {
            const proceedInfo = confirm("⚠️ Gözetleme Kulesi Aktif Değil!\n\nOdaklanmak için kronometremizi kamerasız da kullanabilirsiniz ancak yapay zeka duruşunuzu kontrol edemeyeceği için bu seanstan AquaCoin kazanamazsınız.\n\nYine de kamerasız başlatılsın mı?");
            if (!proceedInfo) return; // "İptal" derse seansı başlatma
        }

        this.isSessionActive = true;
        this.sessionTargetMinutes = parseInt(ui.elements.timeSelector.value);
        this.timeLeft = this.sessionTargetMinutes * 60;
        this.sessionGoodPostureSeconds = 0;

        if (ui.elements.timeSelectorContainer) ui.elements.timeSelectorContainer.classList.add('hidden');

        document.getElementById('start-session-btn').classList.add('hidden');
        document.getElementById('stop-session-btn').classList.remove('hidden');

        const progressBar = document.getElementById('session-progress');
        const totalDuration = this.timeLeft;

        this.sessionTimer = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateTimeStr();

                const percentage = ((totalDuration - this.timeLeft) / totalDuration) * 100;
                progressBar.style.width = percentage + "%";

                // Dik duruş saniyelerini topla (CANLI VERMIYORUZ)
                if (poseManager.isCalibrated && poseManager.isGoodPosture) {
                    this.sessionGoodPostureSeconds++;
                }
            } else {
                // SÜRE BİTİMİ (BAŞARI!)
                clearInterval(this.sessionTimer);
                this.finishSessionSuccessfully();
            }
        }, 1000);
    },

    finishSessionSuccessfully: function () {
        this.isSessionActive = false;

        document.getElementById('start-session-btn').classList.remove('hidden');
        document.getElementById('stop-session-btn').classList.add('hidden');
        if (ui.elements.timeSelectorContainer) ui.elements.timeSelectorContainer.classList.remove('hidden');
        document.getElementById('session-progress').style.width = "0%";

        this.timeLeft = parseInt(ui.elements.timeSelector.value) * 60;
        this.updateTimeStr();

        // ÖDÜL KAZANIMI (Her 300 saniye (5 Dk) dik duruş için 1 Coin)
        const earnedCoins = Math.floor(this.sessionGoodPostureSeconds / 300);

        ui.showResultModal(this.sessionTargetMinutes, this.sessionGoodPostureSeconds, earnedCoins);
        
        // Seans Başarı Sesi Çal
        try {
            this.successAudio.currentTime = 0;
            this.successAudio.play().catch(e => console.log("Ses çalma engellendi:", e));
        } catch(err) {}

        // Gemini AI Motivasyon Mesajı Üret
        const goodMins = Math.floor(this.sessionGoodPostureSeconds / 60);
        if (typeof geminiManager !== 'undefined') {
            geminiManager.generateMotivationMessage(this.sessionTargetMinutes, goodMins, earnedCoins);
        }
        if (window.auth && window.auth.currentUser && this.userData) {
            this.coins += earnedCoins;
            this.userData.failedSessions = 0; // Seriyi (Fail) sıfırla

            if (earnedCoins > 0) ui.updateCoins(this.coins);

            // Streak algoritması da eklenebilir ama şu an için sadece coin & fail reset yapıyoruz
            window.db.collection("users").doc(window.auth.currentUser.uid).update({
                coins: this.coins,
                failedSessions: 0
            });

            // SEANS KAYDI (HAFTALIK RAPOR İÇİN)
            dbManager.saveSessionRecord(window.auth.currentUser.uid, {
                totalMinutes: this.sessionTargetMinutes,
                goodMinutes: goodMins,
                earnedCoins: earnedCoins
            });
        }
    },

    stopSession: async function () {
        this.isSessionActive = false;
        clearInterval(this.sessionTimer);

        document.getElementById('start-session-btn').classList.remove('hidden');
        document.getElementById('stop-session-btn').classList.add('hidden');
        if (ui.elements.timeSelectorContainer) ui.elements.timeSelectorContainer.classList.remove('hidden');

        this.timeLeft = parseInt(ui.elements.timeSelector.value) * 60;
        this.updateTimeStr();
        document.getElementById('session-progress').style.width = "0%";

        let warningMsg = "Seansı erken bitirdiğiniz veya kameranızı kapadığınız için maalesef puan kazanamadınız. Biriken saniyeleriniz yandı!";

        // Phase 4/7: Başarısız seans cezası (3 defa olursa balık gider)
        if (window.auth && window.auth.currentUser && this.userData) {
            const res = await dbManager.handleFailedSession(window.auth.currentUser.uid, this.userData);
            if (res.success) {
                this.userData.failedSessions = res.newFails;
                if (res.lostFish) {
                    this.userData.fishes = res.newFishes;
                    ui.renderAquarium(this.userData.fishes); // Kaybedilen balığı ekrandan sil

                    const lostFishObj = window.FISH_CATALOG.find(f => f.id === res.lostFish);
                    const fishName = lostFishObj ? lostFishObj.name : "bir balık";

                    warningMsg = `ÜZGÜNÜZ! Üst üste 3 başarısız seans sonucunda akvaryumdan ${fishName} türünü kaybettin. Bu balığı geri kazanmak için marketten satın alman gerekecek.`;
                } else {
                    warningMsg += `\n\n(DİKKAT: Üst üste durdurulan başarısız seans sayınız: ${res.newFails}/3)`;
                }
            }
        }

        setTimeout(() => alert(warningMsg), 200);
    },

    requestPermissions: function () {
        // İzinleri Kontrol Et: Bildirim
        if ("Notification" in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log("Bildirim izni alındı.");
                    new Notification("AquaPosture", { body: "Bildirimler aktif edildi! Teşekkürler." });
                }
            });
        }
    },

    clearAlerts: function () {
        if (this.alertInterval) {
            clearInterval(this.alertInterval);
            this.alertInterval = null;
        }
        document.title = "🌊 AquaPosture";
        this.didNotifySlouch = false;
    },

    updateTimeStr: function () {
        const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
        const s = (this.timeLeft % 60).toString().padStart(2, '0');
        ui.updateTimer(`${m}:${s}`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
