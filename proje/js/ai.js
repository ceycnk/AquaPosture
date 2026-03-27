// ai.js - Gemini AI Motivasyon Sistemi
const geminiManager = {
    apiKey: "AIzaSyDFLJ3ObnH18DYv-gZqG5oCzQYFZRnrjOE",
    model: "gemini-1.5-flash",

    generateMotivationMessage: async function (totalTime, goodTime, coins) {
        try {
            ui.showAILoading();

            const prompt = `Sen AquaPosture isimli duruş düzeltme uygulamasının motivasyon asistanısın. 
            Kullanıcı az önce bir seansı başarıyla tamamladı. 
            Seans Özeti:
            - Toplam Süre: ${totalTime} dakika
            - Dik Duruş Süresi: ${goodTime} dakika
            - Kazanılan Puan: ${coins} AquaCoin
            
            Lütfen kullanıcıyı tebrik eden, deniz temalı (balıklar, mercanlar, okyanus esintisi), 
            neşeli ve en fazla 2 cümlelik kısa bir motivasyon mesajı yaz. Yanıtında sadece mesaj olsun. Türkçe konuş.`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
                const aiMsg = data.candidates[0].content.parts[0].text.trim();
                ui.showAIMessage(aiMsg);
            } else {
                throw new Error("Gemini API'den geçersiz yanıt geldi.");
            }

        } catch (error) {
            console.error("Gemini AI Hatası:", error);
            ui.showAIMessage("Harika bir seanstı! Derinlerdeki tüm dostların senin bu dik duruşunla gurur duyuyor. ✨");
        }
    }
};
