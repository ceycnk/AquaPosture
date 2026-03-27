// db.js - Firestore Veritabanı İşlemleri
const dbManager = {
    
    // Kullanıcı Giriş Yaptığında Veritabanını Kontrol/Kayıt Etme
    initUserDoc: async function(uid, displayName) {
        try {
            const userRef = window.db.collection("users").doc(uid);
            const doc = await userRef.get();
            
            if (!doc.exists) {
                // İlk defa giriş yapıyorsa (Yeni Kayıt)
                const newData = {
                    displayName: displayName || "Adsız Yüzücü",
                    username: "", // Phase 6: Username
                    coins: 0,
                    fishes: ["clownfish"], // Başlangıç hediye balığı
                    streak: 0,
                    friends: [], // Phase 6: Sosyal
                    friendRequestsIn: [],
                    friendRequestsOut: []
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
            alert("Veritabanı bağlantı hatası: " + e.message);
            return null;
        }
    },
    
    // Kazanılan paraları anında kaydet
    updateCoins: async function(uid, newCoinTotal) {
        try {
            await window.db.collection("users").doc(uid).update({
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
            
            await window.db.collection("users").doc(uid).update({
                coins: newTotal,
                fishes: newFishes
            });
            console.log(`Firestore: Yeni balık alındı -> ${newFishId}`);
            
            return { success: true, newTotal, newFishes };
        } catch (e) {
            console.error("Buy fish hatası:", e);
            return { success: false, reason: "Veritabanı bağlantı hatası" };
        }
    },
    
    // Phase 4/7: Başarısız Seans Kaybı İşleme
    handleFailedSession: async function(uid, userData) {
        try {
            let fails = (userData.failedSessions || 0) + 1;
            let lostFish = null;
            let newFishes = [...(userData.fishes || [])];
            
            // 3 başarısız seans olduysa
            if (fails >= 3) {
                fails = 0; // Sayacı sıfırla
                if (newFishes.length > 0) {
                    const randomIndex = Math.floor(Math.random() * newFishes.length);
                    lostFish = newFishes[randomIndex];
                    newFishes.splice(randomIndex, 1);
                }
            }
            
            await window.db.collection("users").doc(uid).update({
                failedSessions: fails,
                fishes: newFishes
            });
            
            return { success: true, newFails: fails, lostFish: lostFish, newFishes: newFishes };
        } catch (e) {
            console.error("Failed session update error:", e);
            return { success: false };
        }
    },
    
    // --- SOCIAL LAYER (PHASE 6) ---

    // 1. Username Güncelleme
    updateUsername: async function(uid, username) {
        try {
            // Önce bu kullanıcı adının başka biri tarafından alınıp alınmadığını kontrol et
            const snapshot = await window.db.collection("users").where("username", "==", username).get();
            
            // Eğer sonuç boş değilse ve bulduğumuz döküman BİZE ait değilse, isim alınmıştır
            const isTaken = snapshot.docs.some(doc => doc.id !== uid);
            
            if (isTaken) {
                return { success: false, reason: "Bu kullanıcı adı zaten kullanımda!" };
            }

            await window.db.collection("users").doc(uid).update({ username: username });
            console.log("Firestore: Username güncellendi ->", username);
            return { success: true };
        } catch (e) {
            console.error("Username güncelleme hatası:", e);
            return { success: false, reason: "Veritabanı erişim hatası." };
        }
    },
    
    // 2. Sosyal Verileri (Liderlik, İstekler, Arkadaşlar) Getirme
    getSocialData: async function(uid, userData) {
        try {
            // Arkadaşları getir
            let rawFriends = [];
            if (userData.friends && userData.friends.length > 0) {
                const friendPromises = userData.friends.map(fUid => window.db.collection("users").doc(fUid).get());
                const friendDocs = await Promise.all(friendPromises);
                rawFriends = friendDocs.filter(d => d.exists).map(d => ({uid: d.id, ...d.data()}));
            }
            
            // İstekleri (Gelen) getirenlerin isimlerini çöz (Sadece UID karmaşasını engelle)
            let friendRequests = [];
            if (userData.friendRequestsIn && userData.friendRequestsIn.length > 0) {
                const reqPromises = userData.friendRequestsIn.map(reqUid => window.db.collection("users").doc(reqUid).get());
                const reqDocs = await Promise.all(reqPromises);
                friendRequests = reqDocs.filter(d => d.exists).map(d => ({uid: d.id, username: d.data().username || "Bilinmeyen"}));
            }
            
            // Liderlik Tablosu: Kendim + Arkadaşlar -> coins'e göre desc
            const myself = {uid: uid, ...userData};
            // Kullanıcının kendi username'i yoksa "Ben" yaz.
            if(!myself.username) myself.username = "Ben"; 
            
            const leaderboard = [myself, ...rawFriends].sort((a, b) => b.coins - a.coins);
            
            return {
                friends: rawFriends,
                friendRequests: friendRequests,
                leaderboard: leaderboard
            };
        } catch (e) {
            console.error("Social data getirme hatası:", e);
            return { friends: [], friendRequests: [], leaderboard: [] };
        }
    },

    // 3. Senkronize Arkadaş Silme
    removeFriend: async function(uid, friendUid) {
        try {
            const fs = firebase.firestore;
            
            // Kendi listemden arkadaşı çıkar
            await window.db.collection("users").doc(uid).update({
                friends: fs.FieldValue.arrayRemove(friendUid)
            });
            
            // Arkadaşımın listesinden beni (uid) çıkar
            await window.db.collection("users").doc(friendUid).update({
                friends: fs.FieldValue.arrayRemove(uid)
            });
            
            console.log("Firestore: İki kullanıcının arkadaşlığı başarıyla silindi (Senkronik).");
            return true;
        } catch (e) {
            console.error("Arkadaş silme hatası:", e);
            return false;
        }
    },

    // 4. Arkadaşlık İstekleri
    sendFriendRequest: async function(uid, targetUsername) {
        try {
            const snapshot = await window.db.collection("users").where("username", "==", targetUsername).get();
            if(snapshot.empty) return {success: false, reason: "Kullanıcı adı bulunamadı!"};
            
            const targetDoc = snapshot.docs[0];
            const targetUid = targetDoc.id;
            
            if(targetUid === uid) return {success: false, reason: "Kendinize istek gönderemezsiniz!"};
            
            const fs = firebase.firestore;
            
            await window.db.collection("users").doc(targetUid).update({
                friendRequestsIn: fs.FieldValue.arrayUnion(uid)
            });
            await window.db.collection("users").doc(uid).update({
                friendRequestsOut: fs.FieldValue.arrayUnion(targetUid)
            });
            
            return {success: true};
        } catch(e) {
            return {success: false, reason: "Veritabanı bağlantı hatası"};
        }
    },

    acceptFriendRequest: async function(uid, reqUid) {
        try {
            const fs = firebase.firestore;
            
            // Benden isteği sil, arkadaşa ekle
            await window.db.collection("users").doc(uid).update({
                friendRequestsIn: fs.FieldValue.arrayRemove(reqUid),
                friends: fs.FieldValue.arrayUnion(reqUid)
            });
            
            // Ondan giden isteği sil, arkadaşa ekle
            await window.db.collection("users").doc(reqUid).update({
                friendRequestsOut: fs.FieldValue.arrayRemove(uid),
                friends: fs.FieldValue.arrayUnion(uid)
            });
            
            return true;
        } catch (e) {
            console.error("Istek kabul hatası", e);
            return false;
        }
    }
};
