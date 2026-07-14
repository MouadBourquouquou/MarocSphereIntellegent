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
