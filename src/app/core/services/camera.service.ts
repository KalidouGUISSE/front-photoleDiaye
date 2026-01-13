import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  
  async capturePhoto(): Promise<string> {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('La caméra n\'est pas supportée sur cet appareil');
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;

      // Create modal overlay
      const overlay = this.createCameraOverlay(video);
      document.body.appendChild(overlay);

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      // Return promise that resolves when photo is captured
      return new Promise((resolve, reject) => {
        const captureBtn = overlay.querySelector('#capture-btn') as HTMLButtonElement;
        const cancelBtn = overlay.querySelector('#cancel-btn') as HTMLButtonElement;

        captureBtn.onclick = async () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(video, 0, 0);

            // Stop camera
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(overlay);

            // Compress and return
            const base64 = canvas.toDataURL('image/jpeg', 0.8);
            const compressed = await this.compressImage(base64, 800, 600, 0.8);
            resolve(compressed);
          } catch (error) {
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(overlay);
            reject(error);
          }
        };

        cancelBtn.onclick = () => {
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(overlay);
          reject(new Error('Capture annulée'));
        };
      });
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Accès à la caméra refusé. Veuillez autoriser l\'accès à la caméra.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('Aucune caméra trouvée sur cet appareil.');
      } else {
        throw new Error(error.message || 'Erreur lors de l\'accès à la caméra');
      }
    }
  }

  private createCameraOverlay(video: HTMLVideoElement): HTMLDivElement {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: black;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
      width: 100%;
      max-width: 640px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 20px;
    `;

    video.style.cssText = `
      width: 100%;
      max-height: 70vh;
      border-radius: 8px;
      object-fit: cover;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 16px;
      width: 100%;
      max-width: 400px;
    `;

    const captureBtn = document.createElement('button');
    captureBtn.id = 'capture-btn';
    captureBtn.innerHTML = `
      <svg style="width: 24px; height: 24px; margin-right: 8px; display: inline;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      Capturer
    `;
    captureBtn.style.cssText = `
      flex: 1;
      padding: 12px 24px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    `;
    captureBtn.onmouseover = () => captureBtn.style.background = '#2563eb';
    captureBtn.onmouseout = () => captureBtn.style.background = '#3b82f6';

    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-btn';
    cancelBtn.textContent = 'Annuler';
    cancelBtn.style.cssText = `
      flex: 1;
      padding: 12px 24px;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    `;
    cancelBtn.onmouseover = () => cancelBtn.style.background = '#4b5563';
    cancelBtn.onmouseout = () => cancelBtn.style.background = '#6b7280';

    buttonContainer.appendChild(captureBtn);
    buttonContainer.appendChild(cancelBtn);
    container.appendChild(video);
    container.appendChild(buttonContainer);
    overlay.appendChild(container);

    return overlay;
  }

  private compressImage(base64: string, maxWidth: number, maxHeight: number, quality: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.src = base64;
    });
  }
}