import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, OnInit, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClientService } from '../../../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { ChatService } from '../../../../services/chat.service';
import { ClientProfile, Itineraire, Reservation, ChatMessage } from '../../../../models/api.models';
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
export class DashboardClient implements OnInit, AfterViewChecked {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);
  private chatService = inject(ChatService);

  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;

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
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
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
