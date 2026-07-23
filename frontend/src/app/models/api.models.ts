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

export interface Reservation {
  id: number;
  clientId: number;
  guideId: number | null;
  statut: string;
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
  guideId: number;
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

export interface Experience {
  id: number;
  guideId: number;
  titre: string;
  description: string;
  localisation: string;
  duree: string;
  prix: string;
  categorie: string;
  image: string;
  note: number;
  nombreReservations: number;
  statut: 'PUBLISHED' | 'DRAFT';
  dateCreation: string;
}

export interface ExperienceCreationRequest {
  titre: string;
  description: string;
  localisation: string;
  duree: string;
  prix: string;
  categorie: string;
  image: string;
  statut: string;
}

export interface GuideReservation {
  id: number;
  clientId: number;
  guideId: number;
  statut: string;
  date: string;
  clientNom: string;
  clientPrenom: string;
  clientEmail: string;
  clientTelephone: string;
  clientNationalite: string;
}

export interface Avis {
  id: number;
  auteurId: number;
  cibleId: number | null;
  artisanId: number | null;
  note: number;
  commentaire: string;
}

export interface GuideConversation {
  id: number;
  guideId: number;
  clientId: number;
  clientNom: string;
  clientPrenom: string;
  dernierMessage: string;
  dateDernierMessage: string;
  messagesNonLus: number;
}

export interface GuideMessage {
  id: number;
  conversationId: number;
  contenu: string;
  role: 'USER' | 'AI';
  dateEnvoi: string;
}

export interface GuideMessageCreationRequest {
  conversationId: number;
  contenu: string;
}
