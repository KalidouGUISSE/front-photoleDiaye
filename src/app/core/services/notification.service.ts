import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import type { Notification } from '../models/notification.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  
  unreadCount = signal(0);

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notification`).pipe(
      tap(notifications => {
        const unread = notifications.filter(n => !n.isRead).length;
        this.unreadCount.set(unread);
      })
    );
  }

  markAsRead(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${environment.apiUrl}/notification/${id}/read`, {}).pipe(
      tap(() => {
        this.unreadCount.update(count => Math.max(0, count - 1));
      })
    );
  }
}