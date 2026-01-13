import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../core/services/annonce.service';
import type { Annonce } from '../../core/models/annonce.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeAgoPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private annonceService = inject(AnnonceService);
  
  annonces = signal<Annonce[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAnnonces();
  }

  loadAnnonces(): void {
    this.loading.set(true);
    this.annonceService.getAll().subscribe({
      next: (data) => {
        // Sort: VIP first, then by date
        const sorted = data.sort((a, b) => {
          if (a.user.role === 'VIP' && b.user.role !== 'VIP') return -1;
          if (a.user.role !== 'VIP' && b.user.role === 'VIP') return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.annonces.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des annonces');
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
}