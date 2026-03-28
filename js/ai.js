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
            ui.showWeeklyReportLoading();

            // Firestore'dan son 7 günün verilerini çek
            const sessions = await dbManager.getWeeklySessions(uid);
            
            // Grafik verilerini her durumda hazırla (Boş olsa bile dünü/bugünü görelim)
            const chartData = [];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' }).replace('.', '');
                
                const dayMins = sessions
                    .filter(s => new Date(s.timestamp).toDateString() === date.toDateString())
                    .reduce((acc, s) => acc + (s.totalMinutes || 0), 0);
                
                chartData.push({ day: dayName, mins: dayMins });
            }
            const maxMins = Math.max(...chartData.map(d => d.mins), 1);
            chartData.forEach(d => d.percent = Math.max((d.mins / maxMins) * 100, 5));

            if (sessions.length === 0) {
                ui.renderWeeklyReport({
                    report: "Henüz bu hafta seansın yok. Balıklar seni özledi, bir seans başlatmaya ne dersin? 🌊",
                    chartData: chartData
                });
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
                ui.renderWeeklyReport({
                    report: data.report,
                    chartData: chartData
                });
            } else {
                const errorDetail = data.error || `Bağlantı Hatası (Kod: ${response.status})`;
                throw new Error(errorDetail);
            }

        } catch (error) {
            console.error("Haftalık Rapor Hatası:", error);
            ui.renderWeeklyReport(`⚠️ HATA: ${error.message}`);
        }
    }
};
