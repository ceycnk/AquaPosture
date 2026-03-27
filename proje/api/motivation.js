// api/motivation.js - Gemini API Proxy (Vercel Serverless Function)
export default async function handler(req, res) {
    // Sadece POST isteklerini kabul et
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { totalTime, goodTime, coins } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("HATA: GEMINI_API_KEY bulunamadı!");
        return res.status(500).json({ error: 'Sunucu yapılandırma hatası.' });
    }

    const prompt = `Sen AquaPosture isimli duruş düzeltme uygulamasının motivasyon asistanısın. 
    Kullanıcı az önce bir seansı başarıyla tamamladı. 
    Seans Özeti:
    - Toplam Süre: ${totalTime} dakika
    - Dik Duruş Süresi: ${goodTime} dakika
    - Kazanılan Puan: ${coins} AquaCoin
    
    Lütfen kullanıcıyı tebrik eden, deniz temalı (balıklar, mercanlar, okyanus esintisi), 
    neşeli ve en fazla 2 cümlelik kısa bir motivasyon mesajı yaz. Yanıtında sadece mesaj olsun. Türkçe konuş.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            return res.status(200).json({ message: aiMsg });
        } else {
            return res.status(502).json({ error: 'Gemini API geçersiz yanıt verdi.' });
        }
    } catch (error) {
        console.error("Gemini Proxy Hatası:", error);
        return res.status(500).json({ error: 'AI mesajı oluşturulamadı.' });
    }
}
