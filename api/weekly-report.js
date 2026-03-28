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

    const prompt = `Sen AquaPosture isimli akvaryum simülasyonu ve duruş düzeltme uygulamasının bilge "Usta Akvaryum Bakıcısı" asistanısın. 
    Kullanıcının haftalık seans verileri (akvaryum bakım performansı) aşağıdadır:
    - Toplam Bakım Seansı: ${totalSessions}
    - Toplam İlgilenilen Süre: ${totalMinutes} dakika
    - Toplam Dik Duruş (Berrak Su) Süresi: ${totalGoodMinutes} dakika
    - Ortalama Cam Parlaklığı (Duruş Başarısı): %${avgPosture}
    - Bu Hafta Toplanan Yem/Puan: ${totalCoins} AquaCoin
    
    Lütfen bu verileri kullanarak kullanıcıya akvaryum temalı, neşeli ve teşvik edici bir "Haftalık Akvaryum Karnesi" oluştur. 
    İçeriğinde:
    1. Kullanıcının bakım becerisine göre bir unvan ver (Örn: Akvaryum Çaylağı, Japon Balığı Dostu, Resif Koruyucusu, Akvaryum Gurusu vb.).
    2. Verileri bir "Akvaryum Bakım İpucu" olarak analiz et (Örn: %70 altındaysa 'Camlar biraz buğulanmış, daha dik durarak suyu berraklaştırmalısın' gibi).
    3. Gelecek hafta için balıkları mutlu edecek minik bir görev / meydan okuma bırak.
    
    Yanıtını HTML formatında, <h3>, <p>, <ul> ve <strong> etiketlerini kullanarak ver. Stil ekleme, sadece yapısal HTML olsun. 
    Lütfen her seferinde farklı bir hikaye anlatımı veya farklı deniz canlılarının bakış açısını kullan.
    (Not: Bir hafta yengeç, bir hafta bilge kaplumbağa, bir hafta yunus gibi farklı bir personayı yansıtabilirsin.)
    Türkçe konuş.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`, {
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
