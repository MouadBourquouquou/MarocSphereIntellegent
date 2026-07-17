import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Artisan, Produit, ProduitCreationRequest, Commande, CommandeUpdateRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ArtisanService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/artisans`;

  getMe() {
    return this.http.get<Artisan>(`${this.baseUrl}/me`);
  }

  getAll() {
    return this.http.get<Artisan[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Artisan>(`${this.baseUrl}/${id}`);
  }

  updateProfile(id: number, data: Partial<Artisan>) {
    return this.http.put<Artisan>(`${this.baseUrl}/${id}`, data);
  }

  getProduitsByArtisan(artisanId: number) {
    return this.http.get<Produit[]>(`${this.baseUrl}/${artisanId}/produits`);
  }

  createProduit(artisanId: number, data: ProduitCreationRequest) {
    return this.http.post<Produit>(`${this.baseUrl}/${artisanId}/produits`, data);
  }

  updateProduit(produitId: number, data: ProduitCreationRequest) {
    return this.http.put<Produit>(`${API_BASE_URL}/produits/${produitId}`, data);
  }

  deleteProduit(produitId: number) {
    return this.http.delete<void>(`${API_BASE_URL}/produits/${produitId}`);
  }

  getCommandesByArtisan(artisanId: number) {
    return this.http.get<Commande[]>(`${this.baseUrl}/${artisanId}/commandes`);
  }

  updateCommandeStatut(commandeId: number, data: CommandeUpdateRequest) {
    return this.http.put<Commande>(`${API_BASE_URL}/commandes/${commandeId}/statut`, data);
  }
}
