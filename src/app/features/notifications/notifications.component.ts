import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import type { Notification } from '../../core/models/notification.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeAgoPipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  private notificationService = inject(NotificationService);
  
  notifications = signal<Notification[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.notificationService.getAll().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          this.notifications.update(notifications =>
            notifications.map(n =>
              n.id === notification.id ? { ...n, isRead: true } : n
            )
          );
        }
      });
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'expiration':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'moderation':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'expiration':
        return 'text-yellow-600 bg-yellow-100';
      case 'moderation':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  }
}