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
  role: 'USER' | 'AI' | 'GUIDE' | 'ARTISAN';
  dateEnvoi: string;
  guideId?: number;
  artisanId?: number;
  read?: boolean;
}

export interface ChatMessageRequest {
  clientId: number;
  contenu: string;
}

export interface Experience {
  id: number;
  title: string;
  summary: string;
  description: string;
  location: string;
  category: string;
  guideId: number;
  duration: string;
  difficulty: string;
  price: number;
  rating: number;
  reviewsCount: number;
  gallery: string[];
  includedServices: string[];
  availableDates: string[];
  meetingPoint: string;
  mapImageUrl: string;
  reviewHighlights: string[];
}

export interface GuideBookingRequest {
  id: string;
  clientId: number;
  guideId: number;
  itineraryId?: number;
  itineraryTitle?: string;
  date: string;
  startTime: string;
  duration: string;
  travelers: number;
  notes: string;
  status: 'PENDING' | 'ACCEPTED' | 'DENIED';
  type: 'AI' | 'EXPERIENCE';
  createdAt: string;
}

export interface ProductBookingRequest {
  id: string;
  clientId: number;
  artisanId: number;
  productId: number;
  pickupDate: string;
  pickupTime: string;
  quantity: number;
  notes: string;
  status: 'PENDING' | 'ACCEPTED' | 'DENIED';
  createdAt: string;
}

export interface Review {
  id: string;
  artisanId?: number;
  guideId?: number;
  clientId: number;
  rating: number;
  comment: string;
  date: string;
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

export type BookingType = 'ai-itinerary' | 'experience' | 'product';

export type BookingStatus = 'pending' | 'accepted' | 'denied';

export interface Booking {
  id: string;
  clientId: number;
  type: BookingType;
  status: BookingStatus;
  guideId?: number;
  itineraryId?: number;
  date?: string;
  startTime?: string;
  duration?: string;
  travelers?: number;
  artisanId?: number;
  productId?: number;
  pickupDate?: string;
  pickupTime?: string;
  quantity?: number;
  notes: string;
  createdAt: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  time: string;
  description: string;
  location?: string;
}

export interface AIItinerary {
  id: number;
  clientId: number;
  title: string;
  days: ItineraryDay[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  clientId: number;
  guideId: number;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: number;
  senderRole: 'client' | 'guide' | 'artisan';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  role: 'CLIENT' | 'GUIDE' | 'ARTISAN';
  title: string;
  message: string;
  date: string;
  read: boolean;
}
