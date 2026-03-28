// api/weekly-report.js - Gemini API Proxy for Weekly Reports
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { sessions } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Sunucu yapılandırma hatası.' });
    }

    // Seans verilerini özetle
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);
    const totalGoodMinutes = sessions.reduce((acc, s) => acc + (s.goodMinutes || 0), 0);
    const totalCoins = sessions.reduce((acc, s) => acc + (s.earnedCoins || 0), 0);
    const avgPosture = totalMinutes > 0 ? Math.round((totalGoodMinutes / totalMinutes) * 100) : 0;

    const prompt = `Sen AquaPosture isimli akvaryum simülasyonu ve duruş düzeltme uygulamasının bilge deniz canlısı asistanısın. 
    Kullanıcının haftalık özeti:
    - Toplam Süre: ${totalMinutes} dk
    - Dik Duruş: ${totalGoodMinutes} dk
    - Toplanan AquaCoin: ${totalCoins}
    
    Lütfen bu verileri kullanarak kullanıcıya ŞİİRSEL, BİLGE ve MOTİVE EDİCİ bir haftalık özet yaz.
    
    ÖNEMLİ KURALLAR:
    1. Sadece TEK BİR CÜMLE yaz.
    2. Maksimum 10 kelime olsun (Daha uzun yazma!).
    3. Markdown veya HTML kullanma, sadece düz metin olsun.
    4. Türkçe konuş.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 800,
                }
            })
        });

        const data = await response.json();
        
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            let aiMsg = data.candidates[0].content.parts[0].text;
            aiMsg = aiMsg.replace(/```html/g, '').replace(/```/g, '').trim();
            
            return res.status(200).json({ report: aiMsg });
        } else {
            console.error("Gemini API Hata Detayı:", data);
            
            // Eğer model bulunamadıysa (404), mevcut modelleri de listele
            let availableModels = null;
            try {
                const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                const listData = await listRes.json();
                availableModels = listData.models || null;
            } catch (err) {
                console.error("Modelleri listeleme hatası:", err);
            }

            return res.status(502).json({ 
                error: data.error?.message || 'Gemini API geçersiz yanıt verdi veya kota doldu.',
                availableModels: availableModels
            });
        }
    } catch (error) {
        console.error("Gemini Weekly Report Proxy Hatası:", error);
        return res.status(500).json({ error: `Sunucu Hatası: ${error.message}` });
    }
}
