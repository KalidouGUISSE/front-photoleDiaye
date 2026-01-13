import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce.service';
import { CameraService } from '../../../core/services/camera.service';

@Component({
  selector: 'app-annonce-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './annonce-create.component.html',
  styleUrl: './annonce-create.component.css'
})
export class AnnonceCreateComponent {
  private fb = inject(FormBuilder);
  private annonceService = inject(AnnonceService);
  private cameraService = inject(CameraService);
  private router = inject(Router);

  annonceForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  capturedImage = signal<string | null>(null);
  capturingImage = signal(false);

  constructor() {
    this.annonceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      price: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  async capturePhoto(): Promise<void> {
    this.capturingImage.set(true);
    this.error.set(null);

    try {
      const imageBase64 = await this.cameraService.capturePhoto();
      this.capturedImage.set(imageBase64);
    } catch (err: any) {
      this.error.set(err.message || 'Erreur lors de la capture de la photo');
    } finally {
      this.capturingImage.set(false);
    }
  }

  removePhoto(): void {
    this.capturedImage.set(null);
  }

  onSubmit(): void {
    if (this.annonceForm.invalid) {
      this.annonceForm.markAllAsTouched();
      return;
    }

    if (!this.capturedImage()) {
      this.error.set('Veuillez capturer une photo');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formData = {
      ...this.annonceForm.value,
      price: parseFloat(this.annonceForm.value.price),
      imageBase64: this.capturedImage()!
    };

    this.annonceService.create(formData).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => {
          this.router.navigate(['/profile/annonces']);
        }, 2000);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors de la création de l\'annonce');
        this.loading.set(false);
      }
    });
  }

  get title() {
    return this.annonceForm.get('title');
  }

  get description() {
    return this.annonceForm.get('description');
  }

  get price() {
    return this.annonceForm.get('price');
  }
}