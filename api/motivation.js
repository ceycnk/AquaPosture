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
    
    Lütfen kullanıcıyı tebrik eden, neşeli ve her seferinde farklı bir su altı karakterinin (Örn: Bilge Kaplumbağa, Neşeli Yengeç, Zeki Yunus, Sakin Mercan vb.) ağzından yazılmış bir mesaj üret.

    Yanıtını SADECE aşağıdaki JSON formatında ver, başka hiçbir metin ekleme:
    {
      "emoji": "Karakterin emojisi (Örn: 🐢)",
      "persona": "Karakterin ismi (Örn: Bilge Kaplumbağa)",
      "message": "Kullanıcıya mesajın (En fazla 2 cümle)"
    }
    Türkçe konuş.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    topP: 0.95,
                    maxOutputTokens: 250,
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();
        
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            const rawJson = data.candidates[0].content.parts[0].text.trim();
            const parsedData = JSON.parse(rawJson);
            return res.status(200).json(parsedData);
        } else {
            return res.status(502).json({ error: 'Gemini API geçersiz yanıt verdi.' });
        }
    } catch (error) {
        console.error("Gemini Proxy Hatası:", error);
        return res.status(500).json({ error: 'AI mesajı oluşturulamadı.' });
    }
}
