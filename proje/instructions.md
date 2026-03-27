# AquaPosture Geliştirme Kuralları
- **Dil:** Temiz JavaScript (ES6+), HTML5 ve CSS3 (Tailwind).
- **AI Model:** MediaPipe Pose kütüphanesini kullan ve 'landmark' noktalarını 7, 8 (kulak) ve 11, 12 (omuz) olarak referans al.
- **Hata Yönetimi:** Kamera erişimi reddedilirse kullanıcıya şık bir uyarı göster.
- **Kod Yapısı:** Mantıksal işlemleri (AI hesaplamaları) ve görsel işlemleri (akvaryum animasyonları) farklı fonksiyonlarda tut.
- **Performans:** Görüntü işlemeyi saniyede 30 kare (FPS) ile sınırla ki işlemciyi yormasın.
- **Gizlilik:** "Görüntü sunucuya gönderilmiyor" bilgisini konsola ve UI'a yansıt.