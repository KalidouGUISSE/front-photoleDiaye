import type { User } from './user.model';

export interface Annonce {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  views: number;
  isActive: boolean;
  isModerated: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
}

export interface CreateAnnonceRequest {
  title: string;
  description: string;
  imageBase64: string;
  price: number;
}

export interface CreateAnnonceResponse {
  message: string;
  annonceId: string;
}

export interface ModerateAnnonceRequest {
  action: 'approve' | 'reject';
}