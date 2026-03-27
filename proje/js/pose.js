// pose.js - MediaPipe Pose ve duruş hesaplama mantığı (AI beyni)
const poseManager = {
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
        
        if (!window.Pose) {
            console.error("MediaPipe Pose CDN yüklenemedi!");
            return;
        }

        this.pose = new window.Pose({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }});
        
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
            ui.showCameraError("Lütfen tarayıcı ayarlarınızdan kamera izni verip sayfayı yenileyin.");
            return false;
        } // Hata durumunda bu satırlar çalışacak
    },
    
    onResults: function(results) {
        const canvasEl = ui.elements.outputCanvas;
        canvasEl.width = ui.elements.inputVideo.videoWidth || 640;
        canvasEl.height = ui.elements.inputVideo.videoHeight || 480;

        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        
        if (results.poseLandmarks) {
            if (window.drawConnectors && window.POSE_CONNECTIONS) {
                window.drawConnectors(this.canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, {color: 'rgba(255, 255, 255, 0.5)', lineWidth: 2});
                window.drawLandmarks(this.canvasCtx, results.poseLandmarks, {color: '#10B981', lineWidth: 1, radius: 2});
            }
            
            if (!this.isCalibrated) {
                this.calibrate(results.poseLandmarks);
            } else {
                this.analyzePosture(results.poseLandmarks);
            }
        }
        this.canvasCtx.restore();
    },
    
    calibrate: function(landmarks) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];

        if (!leftShoulder || !rightShoulder) return;

        this.calibrationY = (leftShoulder.y + rightShoulder.y) / 2;
        this.isCalibrated = true;
        console.log(`Kalibrasyon tamam. İdeal Omuz Y Seviyesi: ${this.calibrationY.toFixed(3)}`);
        
        if (this.onPostureChange) {
            this.isGoodPosture = true;
            this.onPostureChange(this.isGoodPosture);
        }
    },
    
    analyzePosture: function(landmarks) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        
        if (!leftShoulder || !rightShoulder) return;

        const currentY = (leftShoulder.y + rightShoulder.y) / 2;
        const threshold = this.calibrationY + 0.05; 
        
        const wasGood = this.isGoodPosture;
        this.isGoodPosture = (currentY <= threshold);
        
        if (wasGood !== this.isGoodPosture && this.onPostureChange) {
            this.onPostureChange(this.isGoodPosture);
        }
    }
};
