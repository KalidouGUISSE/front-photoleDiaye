import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Annonce, CreateAnnonceRequest, CreateAnnonceResponse, ModerateAnnonceRequest } from '../models/annonce.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {
  private http = inject(HttpClient);

  getAll(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${environment.apiUrl}/annonce/list`);
  }

  getById(id: string): Observable<Annonce> {
    return this.http.get<Annonce>(`${environment.apiUrl}/annonce/${id}`);
  }

  create(data: CreateAnnonceRequest): Observable<CreateAnnonceResponse> {
    return this.http.post<CreateAnnonceResponse>(`${environment.apiUrl}/annonce/create`, data);
  }

  getPending(): Observable<Annonce[]> {
    return this.http.get<{ annonces: Annonce[]; total: number; message: string }>(`${environment.apiUrl}/annonce/pending`)
      .pipe(
        map(response => response.annonces)
      );
  }

  getMyAnnonces(): Observable<{ annonces: Annonce[]; total: number; message: string }> {
    return this.http.get<{ annonces: Annonce[]; total: number; message: string }>(`${environment.apiUrl}/annonce/my-annonces`);
  }

  moderate(id: string, data: ModerateAnnonceRequest): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${environment.apiUrl}/annonce/moderate/${id}`, data);
  }

  checkExpired(): Observable<{ message: string; expired: number }> {
    return this.http.patch<{ message: string; expired: number }>(`${environment.apiUrl}/annonce/expire`, {});
  }

  getAnnonce1(): Observable<Annonce>{
    return this.http.get<Annonce>(`${environment.apiUrl}/annonce/0185601b-d5af-45fb-8bbb-f5af17a7c44f`)
  }

  getAnnonce10minute(): Observable<Annonce>{
    return timer(0, 10 * 60 * 1000).pipe(
      switchMap(() => this.getAnnonce1())
    );
  }
}