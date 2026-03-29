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
🔗 Yayın Linki: https://aquaposture.vercel.app/
🎥 Demo Video: https://www.loom.com/share/61dc53c75528446b887b73e82dc570df

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

## ⚖️ Metodoloji ve Önemli Notlar

AquaPosture, gelişmiş bir görüntü işleme altyapısı kullansa da aşağıdaki prensipler üzerine inşa edilmiştir:

* **Davranışsal Farkındalık Aracı:** Bu uygulama bir tıbbi cihaz değildir; temel amacı cerrahi hassasiyette ölçüm yapmak değil, kullanıcıda **Bilişsel Farkındalık (Cognitive Awareness)** yaratmaktır.
* **Bağıl Analiz Mantığı:** Tek açılı 2D görüntüleme sistemlerinde %100 medikal doğruluk teknik bir kısıttır. AquaPosture, mutlak açılardan ziyade kullanıcının kendi **baz hattına (baseline)** göre olan ciddi sapmalarını yakalamaya odaklanır.
* **Geri Bildirim Döngüsü:** Odak noktamız statik bir ölçüm değil, akvaryum ekosistemi üzerinden kurulan canlı bir geri bildirim döngüsü ile kullanıcıda kalıcı bir **davranış değişikliği** sağlamaktır.



