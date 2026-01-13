import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnnonceService } from '../../../core/services/annonce.service';
import type { Annonce } from '../../../core/models/annonce.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-annonce-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeAgoPipe],
  templateUrl: './annonce-detail.component.html',
  styleUrl: './annonce-detail.component.css'
})
export class AnnonceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private annonceService = inject(AnnonceService);
  
  annonce = signal<Annonce | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnnonce(id);
    }
  }

  loadAnnonce(id: string): void {
    this.loading.set(true);
    this.annonceService.getById(id).subscribe({
      next: (data) => {
        this.annonce.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Annonce introuvable');
        this.loading.set(false);
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  getDaysUntilExpiration(expiresAt: string): number {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}