# AquaPosture - Geliştirme Görev Listesi (tasks.md)

Bu dosya `prd.md` baz alınarak hazırlanmış, adım adım geliştirme aşamalarını içerir.

## Faz 1: Proje Kurulumu ve Mimari
- [ ] React.js projesinin oluşturulması (Örn: Vite veya Create React App ile)
- [ ] Gerekli temel kütüphanelerin kurulması (`react-router-dom`, Firebase SDK, `mediapipe` vb.)
- [ ] Klasör yapısının oluşturulması (components, pages, services, utils vb.)
- [ ] Projenin GitHub'a yüklenmesi ve Vercel/Netlify ile ilk test yayınının (CI/CD) ayarlanması

## Faz 2: Firebase ve Kimlik Doğrulama (Auth)
- [ ] Firebase projesinin https://console.firebase.google.com/ üzerinden oluşturulması
- [ ] Firestore Veritabanı ve Firebase Authentication (Google Sağlayıcısı) ayarlarının yapılması
- [ ] Google ile Giriş/Çıkış yapabilmek için gerekli Auth servis kodlarının yazılması
- [ ] Giriş ekranı UI (Kullanıcı Arayüzü) tasarımı ve entegrasyonu

## Faz 3: AI Kamera ve Postür Analizi Tabanı
- [ ] Kullanıcıdan tarayıcı üzerinden güvenli kamera iznini talep eden ekran/component'in yapılması
- [ ] `MediaPipe Pose` entegrasyonunun sağlanması (Webcam üzerinden iskelet verisi çekilmesi)
- [ ] Kulak ve omuz noktaları (landmarks) kullanılarak duruş açısı hesaplayan algoritmanın yazılması
- [ ] 3 saniyelik "Kalibrasyon" UX'inin geliştirilmesi (Kullanıcının dik durduğu normalin belirlenmesi)
- [ ] "Kötü Duruş" (Bad Posture) eşiğinin algılanması ve Console'a yazdırılarak test edilmesi

## Faz 4: Odaklanma Seansı, Akvaryum Arayüzü ve Ekonomi
- [ ] Ana ekranda arkaplana yerleşecek Akvaryum (CSS, görsel veya video ile) yapısının kurulması
- [ ] 25 dakikalık oyunlaştırma/odaklanma sayacının (Timer) yapılması
- [ ] Duruş bozulduğunda arka planın CSS `filter: blur()` vb. ile bulanıklaşması efekti
- [ ] Dik durulan her saniye `AquaCoin` bakiyesinin artma mantığının yazılması
- [ ] 3 başarısız seans sonunda (Ceza) akvaryumdan rastgele balık eksiltilmesini sağlayan mantığın yazılması

## Faz 5: Balık Marketi ve Ekonomi Çıktıları
- [ ] Kazanılan AquaCoin'lerin Firebase (Firestore)'a kaydedilmesi
- [ ] Market Arayüzünün tasarlanıp menüye eklenmesi
- [ ] AquaCoin bakiyesine göre kilitli balıkları satın alma işleminin kodlanması
- [ ] Alınan balıkların Ana Ekrandaki (Akvaryumdaki) yerini alması

## Faz 6: Sosyal Özellikler (Arkadaşlık ve Liderlik Tablosu)
- [ ] Firestore'da arkadaş listesi (Friends Schema) veri yapısının modellenmesi
- [ ] Kullanıcı adıyla / UID ile arkadaş ekleme ve istek onaylama komponentlerinin geliştirilmesi
- [ ] Arkadaşlara özel Liderlik Tablosu (Leaderboard) UI ve veri çekme işlemlerinin yapılması
- [ ] Üst üste gün bazlı hedeflere ulaşıldığında yanan / sönen Streak (Alev) sisteminin kurulması

## Faz 7: Test, Optimizasyon ve Canlıya Alım (Final)
- [ ] MediaPipe performans iyileştirmeleri (Tarayıcıyı fazla yormaması için kare atlama vb. teknikler)
- [ ] Gizlilik kuralları (Privacy Policy) uyarısının ekrana net şekilde yansıtılması
- [ ] Cihazlar (Mobil Desktop) arası UI responsive testlerinin yapılması
- [ ] Son build testleri ve uygulamanın Vercel/Netlify üzerinden Public Production alımının gerçekleştirilmesi
