// db.js - Firestore Veritabanı İşlemleri
const dbManager = {
    // db nesnesi auth.js içerisindeki firebase.firestore() tanımından beslenir.
    
    // Kullanıcı Giriş Yaptığında Veritabanını Kontrol/Kayıt Etme
    initUserDoc: async function(uid, displayName) {
        try {
            const userRef = db.collection("users").doc(uid);
            const doc = await userRef.get();
            
            if (!doc.exists) {
                // İlk defa giriş yapıyorsa (Yeni Kayıt)
                const newData = {
                    displayName: displayName || "Adsız Yüzücü",
                    coins: 0,
                    fishes: ["clownfish"], // Başlangıç hediye balığı
                    streak: 0
                };
                await userRef.set(newData);
                console.log("Firestore: Yeni kullanıcı tablosu oluşturuldu!");
                return newData;
            } else {
                // Zaten kayıtlıysa verisini çek
                console.log("Firestore: Başarıyla mevcut kullanıcı çekildi.");
                return doc.data();
            }
        } catch (e) {
            console.error("Firestore initUserDoc hatası:", e);
            alert("Veritabanı (Firestore) bağlantısı kurulamadı! Lütfen Firebase Console üzerinden 'Firestore Database' oluşturduğunuzdan emin olun.");
            return null;
        }
    },
    
    // Kazanılan paraları anında kaydet
    updateCoins: async function(uid, newCoinTotal) {
        try {
            await db.collection("users").doc(uid).update({
                coins: newCoinTotal
            });
            console.log(`Firestore: Coin güncellendi -> ${newCoinTotal}`);
        } catch (e) {
            console.error("Firestore coin güncelleme hatası:", e);
        }
    },
    
    // Marketten Balık Satın Alma İşlemi
    buyFish: async function(uid, currentFishes, currentCoins, newFishId, cost) {
        if (currentCoins < cost) return { success: false, reason: "Bakiye Yetersiz" };
        
        try {
            const newTotal = currentCoins - cost;
            const newFishes = [...currentFishes, newFishId];
            
            await db.collection("users").doc(uid).update({
                coins: newTotal,
                fishes: newFishes
            });
            console.log(`Firestore: Yeni balık alındı -> ${newFishId}`);
            
            return { success: true, newTotal, newFishes };
        } catch (e) {
            console.error("Buy fish hatası:", e);
            return { success: false, reason: "Veritabanı bağlantı hatası" };
        }
    }
};
