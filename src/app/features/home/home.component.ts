import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../core/services/annonce.service';
import type { Annonce } from '../../core/models/annonce.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeAgoPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private annonceService = inject(AnnonceService);
  private platformId = inject(PLATFORM_ID);
  private annonce1Sub?: Subscription;

  annonces = signal<Annonce[]>([]);
  annonce1 = signal<Annonce | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  loadAnnonce1(): void {
    this.annonce1Sub = this.annonceService
      .getAnnonce10minute()
      .subscribe({
        next: (annonce: Annonce) => {
          this.annonce1.set(annonce);
        },
        error: () => {
          console.error('Erreur chargement annonce 1');
        }
      });
    console.log('back');
  }

  ngOnInit(): void {
    this.loadAnnonces();
    // if (isPlatformBrowser(this.platformId)) {
    //   this.loadAnnonce1();
    // }
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

    ngOnDestroy(): void {
      this.annonce1Sub?.unsubscribe();
    }
}