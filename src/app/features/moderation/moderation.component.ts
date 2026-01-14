import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../core/services/annonce.service';
import type { Annonce } from '../../core/models/annonce.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './moderation.component.html',
  styleUrl: './moderation.component.css'
})
export class ModerationComponent implements OnInit {
  private annonceService = inject(AnnonceService);
  
  pendingAnnonces = signal<Annonce[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  processingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPendingAnnonces();
  }

  loadPendingAnnonces(): void {
    this.loading.set(true);
    this.annonceService.getPending().subscribe({
      next: (data) => {
        this.pendingAnnonces.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des annonces');
        this.loading.set(false);
      }
    });
  }

  approve(annonce: Annonce): void {
    this.processingId.set(annonce.id);
    this.annonceService.moderate(annonce.id, { action: 'approve' }).subscribe({
      next: () => {
        this.pendingAnnonces.update(annonces => 
          annonces.filter(a => a.id !== annonce.id)
        );
        this.processingId.set(null);
      },
      error: (err) => {
        this.error.set('Erreur lors de l\'approbation');
        this.processingId.set(null);
      }
    });
  }

  reject(annonce: Annonce): void {
    this.processingId.set(annonce.id);
    this.annonceService.moderate(annonce.id, { action: 'reject' }).subscribe({
      next: () => {
        this.pendingAnnonces.update(annonces => 
          annonces.filter(a => a.id !== annonce.id)
        );
        this.processingId.set(null);
      },
      error: (err) => {
        this.error.set('Erreur lors du rejet');
        this.processingId.set(null);
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
}