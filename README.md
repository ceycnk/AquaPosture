# 🌊 AquaPosture: AI-Powered Gamified Posture Assistant

## 📌 Problem
Modern çalışma ve eğitim hayatında bilgisayar başında geçirilen uzun saatler, farkında olunmayan duruş bozukluklarına (kamburluk) yol açmaktadır. Statik uyarılar genellikle kullanıcı tarafından göz ardı edilmekte, bu durum uzun vadede ciddi iskelet ve kas sistemi sorunlarına neden olmaktadır.

## 💡 Çözüm
AquaPosture, kullanıcıyı dik durmaya teşvik etmek için **MediaPipe Pose** ile gerçek zamanlı iskelet takibi yapar. Uygulama, duruşu bir "dijital akvaryum" ekosistemiyle oyunlaştırır: Dik durdukça su berraklaşır ve ödüller kazanılır, duruş bozulduğunda ise akvaryum bulanıklaşır. **Gemini 1.5 Flash API** entegrasyonu, kullanıcının performansına göre kişiselleştirilmiş motivasyonel geri bildirimler sunarak sürdürülebilir bir alışkanlık dönüşümü sağlar.

### 🧠 Teknik Yaklaşım (AI Architecture)
Bu projede hibrit bir AI mimarisi kullanılmıştır:
* **Edge AI (MediaPipe):** Düşük gecikmeli (low-latency) görüntü işleme ile cihaz üzerinde anlık postür analizi sağlar.
* **Generative AI (Gemini):** Kullanıcı performans verilerini anlamlandırarak bilişsel davranış değişikliğini teşvik eden kişiselleştirilmiş motivasyonel geri bildirimler üretir.

---

## 🚀 Canlı Demo
* **Yayın Linki:** https://aquaposture.netlify.app/
* **Demo Video:** [Buraya varsa Loom veya YouTube video linkini ekle]

---

## 🛠️ Kullanılan Teknolojiler
* **MediaPipe Pose:** Cihaz üzerinde gerçek zamanlı iskelet ve postür analizi.
* **Gemini 1.5 Flash API:** Akıllı asistan ve motivasyonel içerik üretimi.
* **Firebase (Auth & Firestore):** Google ile giriş, arkadaşlık sistemi ve sosyal liderlik tablosu.
* **Tailwind CSS:** Dinamik ve modern kullanıcı arayüzü tasarımı.
* **Vanilla JavaScript:** Hafif ve hızlı uygulama mantığı.

---

## 💻 Nasıl Çalıştırılır?
1.  **Depoyu Klonlayın:**
    ```bash
    git clone [https://github.com/ceycnk/AquaPosture.git](https://github.com/ceycnk/AquaPosture.git)
    ```
2.  **Proje Klasörüne Gidin:**
    ```bash
    cd AquaPosture
    ```
3.  **API Anahtarını Hazırlayın:**
    Bir `.env` dosyası oluşturun ve **Google AI Studio**'dan aldığınız API anahtarını ekleyin:
    ```env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
4.  **Firebase Yapılandırması:**
    Firebase config bilgilerinizi `js/db.js` (veya ilgili dosya) içerisine yerleştirin.
5.  **Çalıştırın:**
    Herhangi bir yerel sunucu (VS Code Live Server gibi) ile `index.html` dosyasını tarayıcıda açın.
