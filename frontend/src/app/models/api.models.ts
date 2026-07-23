export interface ClientProfile {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  languePreferee: string;
  tierAbonnement: string | null;
  dateCreation: string;
}

export interface Itineraire {
  id: number;
  clientId: number;
  genereParIA: boolean;
  jours: string;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type ReservationType = 'GUIDE' | 'HOTEL' | 'RESTAURANT' | 'ACTIVITY' | 'EVENT' | 'TRANSPORT';

export interface Reservation {
  id: number;
  clientId: number;
  clientName: string;
  resourceType: ReservationType;
  resourceId: number;
  resourceName: string;
  statut: ReservationStatus;
  date: string;
}

export interface Guide {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  languePreferee: string;
  numeroLicence: string;
  statutCertification: string;
  scoreCertification: number;
  disponible: boolean;
  dateCreation: string;
}

export interface Artisan {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  nationalite: string;
  languePreferee: string;
  categorieArtisanat: string;
  qrTraceId: string;
  eligibleExport: boolean;
  independant: boolean;
  cooperativeId: number | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  dateCreation: string;
}

export interface ReservationRequest {
  clientId: number;
  resourceType: ReservationType;
  resourceId: number;
  resourceName: string;
  date: string;
}

export interface ChatMessage {
  id: number;
  clientId: number;
  contenu: string;
  role: 'USER' | 'AI';
  dateEnvoi: string;
}

export interface ChatMessageRequest {
  clientId: number;
  contenu: string;
}

export interface Produit {
  id: number;
  nom: string;
  description: string;
  categorie: string;
  prix: number;
  stock: number;
  disponibilite: string;
  note: number;
  nbCommandes: number;
  imageUrl: string;
  materiels: string;
  processFabrication: string;
  artisanId: number;
  dateCreation: string;
}

export interface ProduitCreationRequest {
  nom: string;
  description: string;
  categorie: string;
  prix: number;
  stock: number;
  disponibilite: string;
  note: number;
  imageUrl: string;
  materiels: string;
  processFabrication: string;
}

export interface CommandeItem {
  id: number;
  quantite: number;
  prixUnitaire: number;
  produitId: number;
  produitNom: string;
}

export interface Commande {
  id: number;
  statut: string;
  montantTotal: number;
  adresseLivraison: string;
  methodePaiement: string;
  statutPaiement: string;
  notes: string;
  dateCommande: string;
  clientId: number;
  clientNom: string;
  clientPrenom: string;
  clientEmail: string;
  items: CommandeItem[];
}

export interface CommandeUpdateRequest {
  statut: string;
}

export type MapLocationCategory =
  | 'Hotel'
  | 'Riad'
  | 'Restaurant'
  | 'Attraction'
  | 'Guide'
  | 'Artisan'
  | 'Event'
  | 'DMC';

export interface MapLocation {
  id: number;
  name: string;
  category: MapLocationCategory;
  lat: number;
  lng: number;
  address: string;
  rating: number;
  imageUrl: string;
  description: string;
}
