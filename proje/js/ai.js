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
                ui.showAIMessage(data.message);
            } else {
                throw new Error(data.error || "Sunucudan hatalı yanıt geldi.");
            }

        } catch (error) {
            console.error("Gemini AI Hatası:", error);
            ui.showAIMessage("Harika bir seanstı! Derinlerdeki tüm dostların senin bu dik duruşunla gurur duyuyor. ✨");
        }
    }
};
