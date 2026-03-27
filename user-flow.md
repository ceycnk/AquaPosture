Tabii ki, bu kullanıcı akışını (User Flow) projenin teknik dokümantasyonuna ekleyebileceğin veya bir sunumda kullanabileceğin temiz bir Markdown formatında hazırladım.
Markdown

# 🌊 AquaPosture: Kullanıcı Akış Şeması (User Flow)

Bu döküman, bir kullanıcının uygulamayı ilk açtığı andan seansı bitirdiği ana kadar geçen tüm süreci adım adım tanımlar.

---

### 1. Giriş ve Karşılama (Onboarding)
* **Görsel:** Sade, huzurlu bir dijital akvaryum arka planı ve "Google ile Giriş Yap" butonu.
* **Eylem:** Kullanıcı tek tıkla kimlik doğrulaması yapar.
* **Sistem Yanıtı:** Kullanıcının kayıtlı `AquaCoin` bakiyesi, `Streak` (alev) durumu ve mevcut balık koleksiyonu Firebase üzerinden yüklenir.

### 2. Kalibrasyon (AI Tanımlama)
* **Görsel:** "Hadi Başlayalım! Lütfen dik dur ve kameranı onayla" mesajı.
* **Eylem:** Kullanıcı kamera izni verir ve 3 saniye boyunca ideal dik duruş pozisyonunu alır.
* **Sistem Yanıtı:** **MediaPipe Pose**, kullanıcının omuz ve kulak noktalarını "0 Noktası" (referans açı) olarak kaydeder.

### 3. Seans Kurulumu (Target Setting)
* **Görsel:** Zamanlayıcı (Pomodoro) ve Başarı Hedefi seçimi ekranı.
* **Eylem:** Kullanıcı süreyi (örn. 25 dk) ve dik durma eşiğini (örn. %90 başarı) seçer.
* **Sistem Yanıtı:** Akvaryum canlanır, kronometre geri saymaya başlar.

### 4. Canlı Takip Süreci (Deep Work Mode)
* **Görsel:** Ekranın köşesinde minimal bir iskelet (skeleton) görünümü ve ana alanda yüzen balıklar.
* **Eylem:** Kullanıcı işine veya dersine odaklanır.
* **Senaryo A (Dik Duruş):** AI yeşil ışık yakar, `AquaCoin` sayacı artar, su berrak kalır.
* **Senaryo B (Kambur Duruş):** AI açının bozulduğunu saptar. Ekran kenarları bulanıklaşır (su kirleniyor efekti) ve "Lütfen Dikleş!" uyarısı çıkar.

### 5. Seans Sonu ve Ödül (Post-Session)
* **Görsel:** "Tebrikler! Seansı %94 başarıyla tamamladın" özet ekranı.
* **Eylem:** Kullanıcı kazandığı ödülleri inceler.
* **Sistem Yanıtı:** * **Başarı:** Hedef tuttuysa `AquaCoin` cüzdana eklenir, `Streak` güncellenir.
    * **Başarısızlık:** Üst üste 3. kez hedef şaşarsa, akvaryumdaki rastgele bir balık kaybedilir.

### 6. Sosyal Etkileşim ve Gelişim (Social & Shop)
* **Görsel:** Arkadaş Liderlik Tablosu ve Balık Marketi.
* **Eylem:** Kullanıcı arkadaşının skoruna bakar veya kazandığı parayla yeni bir balık satın alır.
* **Sistem Yanıtı:** Akvaryum görsel olarak zenginleşir, sosyal rekabet motivasyonu tazelenir.