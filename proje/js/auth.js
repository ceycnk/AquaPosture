// auth.js - Firebase Authentication (Kimlik Doğrulama) Yöneticisi

const firebaseConfig = {
  apiKey: "AIzaSyDkWl_Hd3x55oeGS0Qvq2ux3D0PmcB8VTg",
  authDomain: "aquaposture-6626f.firebaseapp.com",
  projectId: "aquaposture-6626f",
  storageBucket: "aquaposture-6626f.firebasestorage.app",
  messagingSenderId: "846889527968",
  appId: "1:846889527968:web:b47eebf9c8f94244c7b7c5",
  measurementId: "G-F7JNHYCZXM"
};

// Vanilla JS Modül Kısıtlaması İçermeyen Compat Sürümünü Başlatıyoruz
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

const authManager = {
    user: null,
    onAuthChange: null,
    
    init: function() {
        // Kullanıcı giriş/çıkış yaptığında otomatik tetiklenen dinleyici
        auth.onAuthStateChanged((user) => {
            this.user = user;
            if (this.onAuthChange) {
                this.onAuthChange(user);
            }
        });
    },
    
    loginWithGoogle: function() {
        const provider = new firebase.auth.GoogleAuthProvider();
        ui.elements.loginBtn.textContent = "Giriş Yapılıyor...";
        ui.elements.loginBtn.disabled = true;
        
        auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Sistem: Başarıyla giriş yapıldı:", result.user.displayName);
            ui.elements.loginBtn.textContent = "Google ile Giriş";
            ui.elements.loginBtn.disabled = false;
        }).catch((error) => {
            console.error("Giriş Hatası:", error);
            // file:// protokolü hatasına özel şık kullanıcı mesajı
            if(error.code === 'auth/operation-not-supported-in-this-environment') {
                alert("Google ile Giriş yapabilmek için uygulamanın bir sunucuda (veya GitHub Pages'ta) çalışması gerekiyor. Bilgisayardan direk çift tıklayarak (file://) giriş yapılamaz.");
            } else {
                alert("Giriş başarısız: " + error.message);
            }
            ui.elements.loginBtn.textContent = "Google ile Giriş";
            ui.elements.loginBtn.disabled = false;
        });
    },
    
    logout: function() {
        auth.signOut().then(() => {
            console.log("Sistem: Başarıyla çıkış yapıldı.");
            // İsteğe bağlı, coinleri burada 0'layabiliriz veya kalmasını sağlayabiliriz.
        }).catch((error) => {
            console.error("Çıkış Hatası:", error);
        });
    }
};
