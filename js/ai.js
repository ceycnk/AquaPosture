// ai.js - Gemini AI Motivasyon Sistemi (Güvenli Proxy Sürümü)
const geminiManager = {
    // API Anahtarı artık sunucu tarafında (Vercel) gizli.
    
    generateMotivationMessage: async function (totalTime, goodTime, coins) {
        try {
            ui.showAILoading();

            // Kendi yazdığımız Vercel Proxy (Serverless Function) adresine soruyoruz
            const response = await fetch("/api/motivation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    totalTime: totalTime,
                    goodTime: goodTime,
                    coins: coins
                })
            });

            const data = await response.json();
            
            if (data && data.message) {
                ui.showAIMessage(data); // Pass whole object: {emoji, persona, message}
            } else {
                throw new Error("Sunucudan hatalı yanıt geldi.");
            }

        } catch (error) {
            console.error("Gemini AI Hatası:", error);
            ui.showAIMessage("Harika bir seanstı! Derinlerdeki tüm dostların senin bu dik duruşunla gurur duyuyor. ✨");
        }
    },

    generateWeeklyReport: async function(uid) {
        try {
            // Firestore'dan son 7 günün verilerini çek
            const sessions = await dbManager.getWeeklySessions(uid);
            
            if (sessions.length === 0) {
                ui.renderWeeklyReport("<p class='text-center py-10 text-gray-400'>Henüz bu hafta tamamlanmış bir seansın bulunmuyor. Hadi bir tane başlat! 🌊</p>");
                return;
            }

            // Proxy API'ye sor
            const response = await fetch("/api/weekly-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessions: sessions })
            });

            const data = await response.json();
            
            if (response.ok && data && data.report) {
                ui.renderWeeklyReport(data.report);
            } else {
                const errorDetail = data.error || `Bağlantı Hatası (Kod: ${response.status})`;
                if (data.availableModels) {
                  const modelsList = data.availableModels.map(m => m.name.replace('models/', '')).join(', ');
                  throw new Error(`${errorDetail} - Mevcut Modelleriniz: ${modelsList}`);
                }
                throw new Error(errorDetail);
            }

        } catch (error) {
            console.error("Haftalık Rapor Hatası:", error);
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            let msg = "Rapor şu an hazırlanırken bir fırtınaya yakalandık. Lütfen sonra tekrar deneyin! 🌪️";
            
            if (isLocal) {
                msg = "⚠️ Localhost'tasınız. Vercel /api fonksiyonları 'vercel dev' komutu olmadan çalışmaz. Lütfen projeyi Vercel'e deploy edin veya vercel dev kullanın.";
            } else if (error.message) {
                msg = `⚠️ HATA: ${error.message}`;
            }

            ui.renderWeeklyReport(`<p class='text-center py-10 text-rose-500 font-bold'>${msg}</p>`);
        }
    }
};
