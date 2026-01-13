import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AnnonceService } from '../../core/services/annonce.service';
import type { Annonce } from '../../core/models/annonce.model';
import type { User } from '../../core/models/user.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeAgoPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private annonceService = inject(AnnonceService);
  
  user = signal<User | null>(null);
  myAnnonces = signal<Annonce[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user.set(user);
      if (user) {
        this.loadMyAnnonces();
      }
    });
  }

  loadMyAnnonces(): void {
    this.loading.set(true);
    this.annonceService.getMyAnnonces().subscribe({
      next: (response) => {
        this.myAnnonces.set(response.annonces);
        this.loading.set(false);
      },
      error: () => {
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

  logout(): void {
    this.authService.logout().subscribe();
  }
}