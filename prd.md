# 📄 PRD: AquaPosture — Mini Web App (v1.0)

**Sürüm:** 1.0  
**Durum:** Geliştirme Öncesi  
**Rol:** Sağlık & Oyunlaştırma Odaklı Web Uygulaması  

---

## 1. Ürün Vizyonu (The "Why")
Kullanıcıların bilgisayar başındaki duruş bozukluklarını, bir dijital akvaryumu hayatta tutma motivasyonuyla iyileştirmek. Statik ve sıkıcı sağlık uyarılarını, arkadaşlarla rekabet edilen dinamik bir oyun ekonomisine dönüştürmek.

## 2. Kullanıcı Hikayeleri (User Stories)
* **Kamera Entegrasyonu:** Tarayıcımı açtığımda kameramın beni tanımasını ve duruşumu takip etmesini istiyorum.
* **Odaklanma Seansı:** 25 dakikalık bir çalışma seansı başlatıp, bu sürede dik durduğum için ödül (AquaCoin) kazanmak istiyorum.
* **Sosyal Rekabet:** Arkadaşlarımı ekleyip, sadece bizim aramızdaki liderlik tablosunda kimin daha "dik" durduğunu yarışarak görmek istiyorum.
* **Kişiselleştirme:** Kazandığım puanlarla marketten daha havalı balıklar alıp akvaryumumu süslemek istiyorum.

---

## 3. Temel Özellikler (Functional Requirements)

### A. AI Gözetleme Kulesi (Postür Analizi)
* **Kamera Erişimi:** Uygulama kullanıcıdan güvenli kamera izni ister.
* **İskelet Takibi:** `MediaPipe Pose` kullanılarak omuz ve kulak noktaları anlık izlenir.
* **Duruş Kararı:** Kulak-omuz açısı belirlenen eşik değerin altına düşerse "Bad Posture" (Kötü Duruş) durumu tetiklenir.

### B. Akvaryum & Ekonomi (Eğlence)
* **Su Durumu:** Duruş bozulduğunda ekranın arkasındaki akvaryum katmanı (CSS Filter) bulanıklaşır.
* **Ekonomi:** Dik durulan her saniye `AquaCoin` biriktirir.
* **Balık Marketi:** Belirli miktarda `AquaCoin` ile yeni ve daha gösterişli balıkların kilidi açılır.
* **Ceza:** 3 başarısız seans sonunda akvaryumdan rastgele bir balık eksilir.

### C. Sosyal & Veri (Arkadaşlık)
* **Giriş Sistemi:** Google ile hızlı giriş (Firebase Auth).
* **Arkadaş Listesi:** Kullanıcı adıyla arkadaş ekleme ve onaylama mekanizması.
* **Liderlik Tablosu:** Sadece ekli arkadaşlar arasında haftalık "En Çok Dik Durma Puanı" toplayanların sıralanması.

---

## 4. Teknik Gereksinimler (The Stack)

| Katman         | Teknoloji            | Neden?                                                                 |
| :------------- | :------------------- | :--------------------------------------------------------------------- |
| **Frontend** | React.js             | Sosyal etkileşimleri ve dinamik akvaryum arayüzünü yönetmek için ideal.|
| **AI Motoru** | MediaPipe Pose       | Görüntüyü sunucuya göndermeden tarayıcıda işleyerek gizlilik sağlar.   |
| **Auth** | Firebase Auth        | Google ile hızlı giriş ve arkadaş ekleme altyapısı için hazır çözüm.   |
| **Database** | Firestore (NoSQL)    | Arkadaşlık ilişkilerini ve anlık skorları saklamak için esnek yapı.    |
| **Hosting** | Vercel / Netlify     | Tek tıkla uygulamayı yayına almak ve sürekli güncel tutmak için.       |

---

## 5. Başarı Metrikleri (KPIs)
* **Günlük Aktif Kullanım:** Kullanıcının uygulamayı günde en az 1 saat açık tutması.
* **Arkadaş Etkileşimi:** Kullanıcıların arkadaş listesindeki rekabet oranı.
* **Koleksiyon Tamamlama:** Marketten alınan toplam balık sayısı.

---

## 6. Riskler ve Çözümler
* **Risk:** Kamera gizliliği endişesi.
* **Çözüm:** Görüntünün yerel işlendiği ve kaydedilmediği bilgisinin net şekilde verilmesi.
* **Risk:** Yanlış ölçüm.
* **Çözüm:** Her seans başında 3 saniyelik hızlı bir "Kalibrasyon" adımı.
