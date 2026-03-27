// pose.js - MediaPipe Pose ve duruş hesaplama mantığı (AI beyni)
import { ui } from './ui.js';

export const poseManager = {
    canvasCtx: null,
    pose: null,
    camera: null,
    
    isGoodPosture: true,
    calibrationY: 0, 
    isCalibrated: false,
    
    onPostureChange: null, 
    
    init: function() {
        console.log("Gizlilik Bilgisi: Kamera görüntüsü sunucuya GÖNDERİLMEZ. İşlemler tarayıcınızda (lokalde) yürütülür.");
        this.canvasCtx = ui.elements.outputCanvas.getContext('2d');
        
        // Window objesindeki fonksiyonlara erişimi optimize edebilmek için CDN üzerinden bekliyoruz
        if (!window.Pose) {
            console.error("MediaPipe Pose CDN yüklenemedi!");
            return;
        }

        this.pose = new window.Pose({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }});
        
        // Instructions'ta belirtildiği gibi performans için complexity 1 (veya 0) ve tracking ideal 
        this.pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        
        this.pose.onResults(this.onResults.bind(this));
    },
    
    startCamera: async function() {
        try {
            // Instructions uyarınca saniyede max 30 kare (FPS kısıtlaması) işlemciyi yormaması için
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640,
                    height: 480,
                    frameRate: { ideal: 30, max: 30 } 
                } 
            });
            ui.elements.inputVideo.srcObject = stream;
            
            ui.hideCameraOverlay();
            
            this.camera = new window.Camera(ui.elements.inputVideo, {
                onFrame: async () => {
                    await this.pose.send({image: ui.elements.inputVideo});
                },
                width: 640,
                height: 480
            });
            this.camera.start();
            return true;
        } catch (error) {
            console.error("Kamera hatası:", error);
            // Şık Hata Yönetimi
            ui.showCameraError("Lütfen tarayıcı ayarlarınızdan kamera izni verip sayfayı yenileyin.");
            return false;
        }
    },
    
    onResults: function(results) {
        // Tuvale (Canvas) Çizim işlemleri
        const canvasEl = ui.elements.outputCanvas;
        canvasEl.width = ui.elements.inputVideo.videoWidth || 640;
        canvasEl.height = ui.elements.inputVideo.videoHeight || 480;

        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        
        if (results.poseLandmarks) {
            // Sadece yüz/omuz/kol iskeletini çizmek (opsiyonel görsel geribildirim)
            if (window.drawConnectors && window.POSE_CONNECTIONS) {
                window.drawConnectors(this.canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, {color: 'rgba(255, 255, 255, 0.5)', lineWidth: 2});
                window.drawLandmarks(this.canvasCtx, results.poseLandmarks, {color: '#10B981', lineWidth: 1, radius: 2});
            }
            
            // Postür kontrolü
            if (!this.isCalibrated) {
                this.calibrate(results.poseLandmarks);
            } else {
                this.analyzePosture(results.poseLandmarks);
            }
        }
        this.canvasCtx.restore();
    },
    
    calibrate: function(landmarks) {
        // Referans Noktaları (0 Noktası) Instructions: Kulak(7,8) ve Omuz(11,12)
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftEar = landmarks[7];
        const rightEar = landmarks[8];

        if (!leftShoulder || !rightShoulder) return;

        // Omuz Y ekseni ortalaması alınarak duruşun referans konumu belirlenir.
        this.calibrationY = (leftShoulder.y + rightShoulder.y) / 2;
        this.isCalibrated = true;
        console.log(`İlk 3 saniye bitti, Kalibrasyon tamam. İdeal Omuz Y Seviyesi: ${this.calibrationY.toFixed(3)}`);
        
        if (this.onPostureChange) {
            // Kalibre olur olmaz iyi duruş moduna geç
            this.isGoodPosture = true;
            this.onPostureChange(this.isGoodPosture);
        }
    },
    
    analyzePosture: function(landmarks) {
        // Kamerada (y) ekseni yukarıdan aşağı artar.
        // Omuzlar normalden daha aşağı sarkarsa (veya kambur durunca ileri gidip aşağı düşerse) Y artar.
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        
        if (!leftShoulder || !rightShoulder) return;

        const currentY = (leftShoulder.y + rightShoulder.y) / 2;
        
        // "Bad Posture" Eşiği: Kalibrasyon seviyesinden %15 (0.05 puan genelde ideal) gibi daha aşağıya büküldüyse
        const threshold = this.calibrationY + 0.05; 
        
        const wasGood = this.isGoodPosture;
        // Mevcut Y eşikten darsa iyi duruş, büyükse kötü (omuzlar çökmüş)
        this.isGoodPosture = (currentY <= threshold);
        
        if (wasGood !== this.isGoodPosture && this.onPostureChange) {
            this.onPostureChange(this.isGoodPosture);
        }
    }
};
