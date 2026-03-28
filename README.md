# AquaPosture 🌊

## Problem
Uzun saatler ekran başında çalışmak, fark edilmeden omurga sağlığını bozuyor ve
kronik boyun-sırt ağrılarına yol açıyor. Mevcut hatırlatıcı uygulamalar ise 
kullanıcıyı yeterince motive edemediği için hızla terk ediliyor.

## Çözüm
AquaPosture, web kamerası üzerinden **MediaPipe** ile kullanıcının omuz ve baş 
pozisyonunu gerçek zamanlı analiz eder. Dik duran kullanıcıya **AquaCoin** ödülü 
vererek dijital bir akvaryum büyütmesini sağlar; kamburluk tespit edildiğinde ise 
akvaryumun camları buğulanır, balıklar huzursuzlaşır. **Google Gemini AI**, seans 
sonunda kullanıcının performansına göre farklı deniz canlısı karakterleri aracılığıyla 
kişiselleştirilmiş motivasyon mesajları ve haftalık görsel raporlar üretir.

## Canlı Demo
🔗 Yayın Linki: `[Vercel linkinizi buraya ekleyin]`  
🎥 Demo Video: `[Loom linkinizi buraya ekleyin]`

## Kullanılan Teknolojiler
- **MediaPipe Pose** — Gerçek zamanlı duruş analizi (Computer Vision)
- **Google Gemini AI** — Kişiselleştirilmiş motivasyon & haftalık rapor
- **Firebase Authentication** — Google ile oturum yönetimi
- **Cloud Firestore** — Kullanıcı verileri & seans kayıtları
- **Vanilla JS / HTML / CSS** — Saf frontend, framework bağımlılığı yok
- **Vercel** — Serverless API proxy & deployment

## Nasıl Çalıştırılır?

### Gereksinimler
- Node.js (Vercel CLI için)
- Firebase projesi + Gemini API anahtarı

### Kurulum
```bash
# Repoyu klonla
git clone https://github.com/ceycnk/AquaPosture.git
cd AquaPosture

# Vercel CLI ile lokal geliştirme ortamını başlat
npx vercel dev
Vercel Dashboard'da aşağıdaki değişkeni tanımlayın:
GEMINI_API_KEY=your_gemini_api_key_here

Not: Firebase yapılandırması js/firebase-config.js içinde yer almaktadır. Firebase Console'da uygulamanızın domain adresini Authorized Domains listesine eklemeyi unutmayın.


# 🌊 AquaPosture

**Sağlıklı duruş alışkanlığını bir yükümlülük değil, bir deneyime dönüştüren web uygulaması.**

Modern çalışma hayatında saatlerce ekran başında oturmak, fark etmeden omurganızı şekillendiriyor. AquaPosture, bu sorunu farklı bir perspektiften ele alır: ceza değil, ödül.

Uygulama, tarayıcı üzerinden web kameranıza erişerek **MediaPipe** ile omuz ve baş pozisyonunuzu gerçek zamanlı analiz eder. Dik durdukça **AquaCoin** kazanırsınız; kazandığınız coinlerle ise dijital akvaryumunuzu büyütürsünüz. Kamburlarsanız? Akvaryumun camları buğulanır, balıklar huzursuzlaşır.

Sistemin kalbinde **Firebase** tabanlı kullanıcı yönetimi, **Firestore** ile bulut senkronizasyonu ve **Google Gemini AI** entegrasyonu bulunur. Gemini, seans sonunda karakterine göre — bazen bilge bir kaplumbağa, bazen neşeli bir yengeç — kişiselleştirilmiş motivasyon mesajları üretir. Haftalık performansınız ise sade bir sütun grafiğiyle karşınıza çıkar.

Sosyal katmanında arkadaşlık sistemi, puan rekabeti ve Zen Modu gibi özellikler uygulamayı bir araçtan çok bir **yaşayan ekosisteme** dönüştürür.

> **Stack:** Vanilla JS · Firebase · Gemini API · MediaPipe · Vercel  
> **Tür:** Fullstack Web App · Gamification · AI Integration · Computer Vision


# 🌊 AquaPosture: AI-Powered Gamified Posture Assistant

## 📌 Problem
Modern çalışma ve eğitim hayatında bilgisayar başında geçirilen uzun saatler, farkında olunmayan duruş bozukluklarına (kamburluk) yol açmaktadır. Statik uyarılar genellikle kullanıcı tarafından göz ardı edilmekte, bu durum uzun vadede ciddi iskelet ve kas sistemi sorunlarına neden olmaktadır.

## 💡 Çözüm
AquaPosture, kullanıcıyı dik durmaya teşvik etmek için **MediaPipe Pose** ile gerçek zamanlı iskelet takibi yapar. Uygulama, duruşu bir "dijital akvaryum" ekosistemiyle oyunlaştırır: Dik durdukça su berraklaşır ve ödüller kazanılır, duruş bozulduğunda ise akvaryum bulanıklaşır. **gemini-flash-latest API** entegrasyonu, kullanıcının performansına göre kişiselleştirilmiş motivasyonel geri bildirimler sunarak sürdürülebilir bir alışkanlık dönüşümü sağlar.

### 🧠 Teknik Yaklaşım (AI Architecture)
Bu projede hibrit bir AI mimarisi kullanılmıştır:
* **Edge AI (MediaPipe):** Düşük gecikmeli (low-latency) görüntü işleme ile cihaz üzerinde anlık postür analizi sağlar.
* **Generative AI (Gemini):** Kullanıcı performans verilerini anlamlandırarak bilişsel davranış değişikliğini teşvik eden kişiselleştirilmiş motivasyonel geri bildirimler üretir. Haftalık Dik Duruş süresi raporu sunar.

---

## 🚀 Canlı Demo
* **Yayın Linki:** https://aquaposture.vercel.app/
* **Demo Video:** https://www.loom.com/share/61dc53c75528446b887b73e82dc570df

---

## 🛠️ Kullanılan Teknolojiler
* **MediaPipe Pose:** Cihaz üzerinde gerçek zamanlı iskelet ve postür analizi.
* **gemini-flash-latest:** Akıllı asistan ve motivasyonel içerik üretimi.
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
    Herhangi bir yerel sunucu (VS Code Live Server gibi) ile `index.html` dosyasını tarayıcıda açın. (Gemini API bu şekilde çalışmayabilir)
