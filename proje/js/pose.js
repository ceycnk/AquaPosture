// pose.js - MediaPipe Pose ve duruş hesaplama mantığı (AI beyni)

const poseManager = {
    canvasCtx: null,

    pose: null,

    camera: null,
    isRunning: false,
    isGoodPosture: true,

    baseNeckY: 0,

    isCalibrated: false,
    isProcessing: false,


    onPostureChange: null,


    init: function () {

        console.log("Gizlilik Bilgisi: Kamera görüntüsü sunucuya GÖNDERİLMEZ. İşlemler tarayıcınızda (lokalde) yürütülür.");

        this.canvasCtx = ui.elements.outputCanvas.getContext('2d');


        if (!window.Pose) {

            console.error("MediaPipe Pose CDN yüklenemedi!");

            return;

        }


        this.pose = new window.Pose({

            locateFile: (file) => {

                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;

            }

        });


        this.pose.setOptions({

            modelComplexity: 1,

            smoothLandmarks: true,

            minDetectionConfidence: 0.5,

            minTrackingConfidence: 0.5

        });


        this.pose.onResults(this.onResults.bind(this));

    },


    startCamera: async function () {

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


            ui.elements.inputVideo.onloadedmetadata = () => {
                ui.elements.inputVideo.play();
                this.isRunning = true;
                this.tick();
            };

            // Eğer video zaten hazırsa manuel tetikle
            if (ui.elements.inputVideo.readyState >= 2) {
                ui.elements.inputVideo.onloadedmetadata();
            }

            return true;

        } catch (error) {

            console.error("Kamera hatası:", error);

            ui.showCameraError("Lütfen tarayıcı ayarlarınızdan kamera izni verip sayfayı yenileyin.");

            return false;

        } // Hata durumunda bu satırlar çalışacak

    },


    stopCamera: function () {
        this.isRunning = false;
        if (this.camera) {

            this.camera.stop();

        }
        this.isProcessing = false;
        if (ui.elements.inputVideo.srcObject) {

            const tracks = ui.elements.inputVideo.srcObject.getTracks();

            tracks.forEach(track => track.stop());

            ui.elements.inputVideo.srcObject = null;

        }

        this.isCalibrated = false;

        this.isGoodPosture = true;

    },


    onResults: function (results) {

        const canvasEl = ui.elements.outputCanvas;

        canvasEl.width = ui.elements.inputVideo.videoWidth || 640;

        canvasEl.height = ui.elements.inputVideo.videoHeight || 480;


        this.canvasCtx.save();

        this.canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);


        if (results.poseLandmarks) {

            if (window.drawConnectors && window.POSE_CONNECTIONS) {

                window.drawConnectors(this.canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: 'rgba(255, 255, 255, 0.5)', lineWidth: 2 });

                window.drawLandmarks(this.canvasCtx, results.poseLandmarks, { color: '#10B981', lineWidth: 1, radius: 2 });

            }


            if (!this.isCalibrated) {

                this.calibrate(results.poseLandmarks);

            } else {

                this.analyzePosture(results.poseLandmarks);

            }

        }

        this.canvasCtx.restore();
    },

    calibrate: function (landmarks) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftEar = landmarks[7];
        const rightEar = landmarks[8];

        if (!leftShoulder || !rightShoulder || !leftEar || !rightEar) return;

        const midEarY = (leftEar.y + rightEar.y) / 2;
        const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;

        this.baseNeckY = midShoulderY - midEarY;
        this.isCalibrated = true;
        console.log(`Kalibrasyon tamam. İdeal: ${this.baseNeckY.toFixed(3)}`);

        if (this.onPostureChange) {
            this.isGoodPosture = true;
            this.onPostureChange(this.isGoodPosture);
        }
    },

    analyzePosture: function (landmarks) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftEar = landmarks[7];
        const rightEar = landmarks[8];

        if (!leftShoulder || !rightShoulder || !leftEar || !rightEar) return;

        const midEarY = (leftEar.y + rightEar.y) / 2;
        const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
        const currentNeckY = midShoulderY - midEarY;

        const threshold = this.baseNeckY * 0.80;
        const wasGood = this.isGoodPosture;
        this.isGoodPosture = (currentNeckY >= threshold);

        if (wasGood !== this.isGoodPosture && this.onPostureChange) {
            this.onPostureChange(this.isGoodPosture);
        }
    },

    // Background-Resilient Loop
    tick: async function() {
        if (!this.isRunning) return;

        const isHidden = document.visibilityState === 'hidden';
        
        if (!this.isProcessing) {
            this.isProcessing = true;
            try {
                await this.pose.send({ image: ui.elements.inputVideo });
                if(isHidden) console.log("Arkaplan takibi aktif...");
            } catch (e) {
                console.error("Takip Hatası:", e);
            } finally {
                this.isProcessing = false;
            }
        }

        if (isHidden) {
            setTimeout(() => this.tick(), 1000);
        } else {
            setTimeout(() => this.tick(), 100); 
        }
    }
};