import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  OnInit,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import * as L from 'leaflet';
import { ClientService } from '../../../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { ChatService } from '../../../../services/chat.service';
import { LandmarkService, LandmarkItem } from '../../../../services/landmark.service';
import {
  ClientProfile,
  Itineraire,
  Reservation,
  ChatMessage,
} from '../../../../models/api.models';
import {
  avatarUrl,
  fullName,
  itineraireDaysCount,
  itineraireTitle,
} from '../../../../utils/display.utils';

@Component({
  selector: 'app-dashboard-client',
  imports: [RouterLink],
  templateUrl: './dashClient.html',
  styleUrls: ['./dashClient.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardClient implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);
  private chatService = inject(ChatService);
  private landmarkService = inject(LandmarkService);

  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  isLoading = signal(true);
  errorMessage = signal('');
  client = signal<ClientProfile | null>(null);
  itineraires = signal<Itineraire[]>([]);
  reservations = signal<Reservation[]>([]);

  chatMessages = signal<ChatMessage[]>([]);
  chatInput = signal('');
  isSending = signal(false);
  private shouldScroll = false;
  sidebarOpen = false;












  

  landmarks = signal<LandmarkItem[]>([]);
  filteredLandmarks = signal<LandmarkItem[]>([]);
  landmarkCategories = signal<string[]>([]);
  landmarkZones = signal<string[]>([]);
  selectedCategorie = signal<string | null>(null);
  selectedZone = signal<string | null>(null);

  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private mapInitialized = false;

  displayName = computed(() => {
    const profile = this.client();
    return profile ? fullName(profile.prenom, profile.nom) : 'Client';
  });

  avatar = computed(() => avatarUrl(this.displayName()));

  pendingReservations = computed(
    () => this.reservations().filter((r) => r.statut === 'PENDING').length,
  );

  completedReservations = computed(
    () => this.reservations().filter((r) => r.statut !== 'PENDING').length,
  );

  ngOnInit(): void {
    this.loadDashboard();
    this.loadLandmarks();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  private loadLandmarks(): void {
    this.landmarkService.getAllPublic().subscribe({
      next: (data) => {
        this.landmarks.set(data);
        this.filteredLandmarks.set(data);
        this.landmarkCategories.set([...new Set(data.map((l) => l.categorie))].sort());
        this.landmarkZones.set([...new Set(data.map((l) => l.zone))].sort());
        this.addMarkers(data);
      },
      error: () => {},
    });
  }

  private initMap(): void {
    if (this.mapInitialized || !this.mapContainer) return;

    const center: L.LatLngExpression = [31.6295, -7.9811];

    this.map = L.map(this.mapContainer.nativeElement, {
      center,
      zoom: 11,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(this.map);

    this.mapInitialized = true;
    setTimeout(() => this.map?.invalidateSize(), 200);
  }

  private addMarkers(landmarks: LandmarkItem[]): void {
    if (!this.map) return;
    this.clearMarkers();

    landmarks.forEach((l) => {
      const icon = L.divIcon({
        className: 'landmark-marker',
        html: `<div class="landmark-marker__pin">📍</div>`,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -42],
      });

      const popup = [
        `<strong>${l.nom}</strong>`,
        `${l.categorie} · ${l.zone}`,
        l.prixEntree > 0 ? `${l.prixEntree} MAD` : 'Gratuit',
        l.description ? `<br/>${l.description}` : '',
      ].join('<br/>');

      const marker = L.marker([l.latitude, l.longitude], { icon })
        .addTo(this.map!)
        .bindPopup(popup, { maxWidth: 260 });

      this.markers.push(marker);
    });
  }

  private clearMarkers(): void {
    this.markers.forEach((m) => m.remove());
    this.markers = [];
  }

  private applyFilters(): void {
    const cat = this.selectedCategorie();
    const zone = this.selectedZone();
    const result = this.landmarks().filter(
      (l) => (!cat || l.categorie === cat) && (!zone || l.zone === zone),
    );
    this.filteredLandmarks.set(result);
    this.addMarkers(result);

    if (result.length > 0 && this.map) {
      const bounds = L.latLngBounds(result.map((l) => [l.latitude, l.longitude] as L.LatLngExpression));
      this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }

  filterByCategorie(categorie: string | null): void {
    this.selectedCategorie.set(categorie);
    this.applyFilters();
  }

  filterByZone(zone: string | null): void {
    this.selectedZone.set(zone);
    this.applyFilters();
  }

  flyToLandmark(landmark: LandmarkItem): void {
    if (this.map) {
      this.map.flyTo([landmark.latitude, landmark.longitude], 14, { duration: 1.2 });
      const marker = this.markers.find(
        (m) => m.getLatLng().lat === landmark.latitude && m.getLatLng().lng === landmark.longitude,
      );
      marker?.openPopup();
    }
  }

  centerOnUserLocation(): void {
    if (!this.map) return;

    if (!navigator.geolocation) {
      this.map.flyTo([31.6295, -7.9811], 11, { duration: 1 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.map!.flyTo([pos.coords.latitude, pos.coords.longitude], 12, { duration: 1.2 });

        L.marker([pos.coords.latitude, pos.coords.longitude], {
          icon: L.divIcon({
            className: 'user-location-marker',
            html: '<div class="user-dot"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        })
          .addTo(this.map!)
          .bindPopup('You are here')
          .openPopup();
      },
      () => {
        this.map!.flyTo([31.6295, -7.9811], 11, { duration: 1 });
      },
    );
  }

  loadDashboard(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.clientService.getMe().subscribe({
      next: (profile) => {
        this.client.set(profile);
        forkJoin({
          itineraires: this.clientService.getItineraires(profile.id),
          reservations: this.clientService.getReservations(profile.id),
        }).subscribe({
          next: ({ itineraires, reservations }) => {
            this.itineraires.set(itineraires);
            this.reservations.set(reservations);
            this.isLoading.set(false);
            this.loadChatHistory(profile.id);
          },
          error: () => {
            this.errorMessage.set('Impossible de charger vos voyages et réservations.');
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.errorMessage.set(
          'Impossible de charger votre profil. Connectez-vous avec un compte client.',
        );
        this.isLoading.set(false);
      },
    });
  }

  loadChatHistory(clientId: number): void {
    this.chatService.getHistory(clientId).subscribe({
      next: (messages) => {
        this.chatMessages.set(messages);
        this.shouldScroll = true;
      },
      error: () => {},
    });
  }

  updateChatInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.chatInput.set(input.value);
  }

  sendMessage(): void {
    const contenu = this.chatInput().trim();
    const profile = this.client();
    if (!contenu || !profile || this.isSending()) return;

    this.isSending.set(true);
    this.chatInput.set('');

    this.chatService.sendMessage({ clientId: profile.id, contenu }).subscribe({
      next: (aiMessage) => {
        this.chatMessages.update((msgs) => [
          ...msgs,
          {
            id: Date.now(),
            clientId: profile.id,
            contenu,
            role: 'USER' as const,
            dateEnvoi: new Date().toISOString(),
          },
          aiMessage,
        ]);
        this.isSending.set(false);
        this.shouldScroll = true;
      },
      error: () => {
        this.isSending.set(false);
      },
    });
  }

  sendSuggestion(text: string): void {
    this.chatInput.set(text);
    this.sendMessage();
  }

  onChatKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  resetChat(): void {
    this.chatMessages.set([]);
    const profile = this.client();
    if (profile) {
      this.loadChatHistory(profile.id);
    }
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      const el = this.chatContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  getItineraireTitle(jours: string): string {
    return itineraireTitle(jours);
  }

  getDaysCount(jours: string): number {
    return itineraireDaysCount(jours);
  }

  logout(): void {
    this.authService.logout();
  }
}
