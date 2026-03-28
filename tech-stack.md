# 🛠️ AquaPosture: Önerilen Teknoloji Yığını (Tech Stack)

Bu teknoloji yığını, başlangıç seviyesindeki bir geliştirici için en yüksek verimi ve en düşük kurulum zorluğunu hedefleyerek seçilmiştir.

| Bileşen            | Teknoloji                   | Seçim Nedeni                                                                                   |
| :----------------- | :-------------------------- | :--------------------------------------------------------------------------------------------- |
| **Geliştirme Ortamı** | **Antigravity / AI Studio** | Bulut tabanlıdır; bilgisayara kurulum gerektirmez, Gemini ile yerleşik (native) çalışır.       |
| **Dil & Yapı** | **HTML / CSS / JavaScript** | Web'in ana dilleridir. Her tarayıcıda çalışır, öğrenme eğrisi en düşük olan yapıdır.           |
| **Görüntü İşleme** | **MediaPipe Pose** | Google'ın açık kaynaklı kütüphanesidir. Kameradan iskelet takibini en hızlı yapan araçtır.     |
| **Yapay Zeka (Beyin)**| **Gemini API** | Google AI Studio üzerinden ücretsiz erişilir. Kullanıcıya akıllı ve motivasyonel dönütler verir.|
| **Arayüz (UI)** | **Tailwind CSS** | Modern ve şık bir görünümü, uzun CSS kodları yazmadan sadece sınıf isimleriyle sağlar.         |
| **Veri & Kayıt** | **LocalStorage / Firebase** | Başlangıçta tarayıcı hafızasını (LocalStorage), ileride bulut kaydı (Firebase) kullanmak için. |

---

### ❓ Neden Bu Teknolojileri Seçiyoruz?

1. **Sıfır Kurulum Maliyeti:** Bilgisayarının donanımından bağımsız olarak tamamen tarayıcı üzerinden geliştirme yapabilirsin.
2. **Hızlı Prototipleme:** MediaPipe ve Gemini entegrasyonu sayesinde, karmaşık matematiksel hesaplamaları AI'ya bırakıp sadece "Oyunlaştırma" mantığına odaklanabilirsin.
3. **Gizlilik Odaklı (Privacy-First):** MediaPipe görüntü işlemeyi kullanıcının kendi cihazında yapar, bu da veri güvenliği sunumun için büyük bir artıdır.
4. **Öğrenci Dostu:** Tüm bu ekosistem Google tarafından öğrenciler ve geliştiriciler için ücretsiz sunulmaktadır.
