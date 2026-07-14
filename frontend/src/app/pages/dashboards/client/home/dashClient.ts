import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClientService } from '../../../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { ClientProfile, Itineraire, Reservation } from '../../../../models/api.models';
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
export class DashboardClient implements OnInit {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);

  isLoading = signal(true);
  errorMessage = signal('');
  client = signal<ClientProfile | null>(null);
  itineraires = signal<Itineraire[]>([]);
  reservations = signal<Reservation[]>([]);

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
