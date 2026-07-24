import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  OnInit,
  signal,
  ElementRef,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { ArtisanService } from '../../../../services/artisan.service';
import { ClientService } from '../../../../services/client.service';
import { GuideService } from '../../../../services/guide.service';
import { ReservationService } from '../../../../services/reservation.service';
import { AuthService } from '../../../../services/auth.service';
import { Artisan, ClientProfile, Guide } from '../../../../models/api.models';
import { avatarUrl, fullName } from '../../../../utils/display.utils';

import { isPlatformBrowser } from '@angular/common';

type MarketplaceTab = 'experiences' | 'guides' | 'products';

@Component({
  selector: 'app-marketplace',
  imports: [RouterLink],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class marketplace implements OnInit {
  private artisanService = inject(ArtisanService);
  private guideService = inject(GuideService);
  private clientService = inject(ClientService);
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private isBrowser: boolean;
  private cleanupFns: Array<() => void> = [];

  private setupSmoothScroll(): void {
    const anchors = this.elRef.nativeElement.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchors.forEach((anchor) => {
      const onClick = (event: Event): void => {
        const href = anchor.getAttribute('href');
        if (!href) return;
        const target = this.elRef.nativeElement.querySelector<HTMLElement>(href);
        if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      };
      anchor.addEventListener('click', onClick);
      this.cleanupFns.push(() => anchor.removeEventListener('click', onClick));
    });
  }

  private setupFormPreventDefault(): void {
    const forms = this.elRef.nativeElement.querySelectorAll<HTMLFormElement>('form');
    forms.forEach((form) => {
      const onSubmit = (event: Event): void => { event.preventDefault(); };
      form.addEventListener('submit', onSubmit);
      this.cleanupFns.push(() => form.removeEventListener('submit', onSubmit));
    });
  }

  activeTab = signal<MarketplaceTab>('experiences');

  isLoading = signal(true);
  errorMessage = signal('');
  bookingMessage = signal('');
  searchQuery = signal('');

  client = signal<ClientProfile | null>(null);
  artisans = signal<Artisan[]>([]);
  guides = signal<Guide[]>([]);

  constructor(
    private elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setActiveTab(tab: MarketplaceTab): void {
    this.activeTab.set(tab);
  }

  displayName = computed(() => {
    const profile = this.client();
    return profile ? fullName(profile.prenom, profile.nom) : 'Client';
  });

  avatar = computed(() => avatarUrl(this.displayName()));

    ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.setupSmoothScroll();
    this.setupFormPreventDefault();
  }
  filteredArtisans = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.artisans();
    }
    return this.artisans().filter(
      (a) =>
        `${a.prenom} ${a.nom}`.toLowerCase().includes(query) ||
        a.categorieArtisanat?.toLowerCase().includes(query),
    );
  });

  filteredGuides = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.guides();
    }
    return this.guides().filter(
      (g) =>
        `${g.prenom} ${g.nom}`.toLowerCase().includes(query) ||
        g.languePreferee?.toLowerCase().includes(query),
    );
  });

  ngOnInit(): void {
    this.loadMarketplace();
  }

  loadMarketplace(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.clientService.getMe().subscribe({
      next: (profile) => {
        this.client.set(profile);
        this.guideService.getAll().subscribe({
          next: (guides) => {
            this.guides.set(guides);
          },
          error: () => {
            this.errorMessage.set('Impossible de charger les guides.');
          },
        });
        this.artisanService.getAll().subscribe({
          next: (artisans) => {
            this.artisans.set(artisans);
            this.isLoading.set(false);
          },
          error: () => {
            this.errorMessage.set('Impossible de charger les artisans.');
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.errorMessage.set(
          'Connectez-vous avec un compte client pour accéder à la marketplace.',
        );
        this.isLoading.set(false);
      },
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  bookGuide(guide: Guide): void {
    const profile = this.client();
    if (!profile) {
      return;
    }

    this.bookingMessage.set('');
    this.reservationService
      .create({
        clientId: profile.id,
        guideId: guide.id,
        date: new Date().toISOString(),
      })
      .subscribe({
        next: () => {
          this.bookingMessage.set(`Réservation créée avec ${guide.prenom} ${guide.nom} !`);
        },
        error: (err) => {
          const msg = err.error?.message ?? 'Erreur lors de la réservation.';
          this.bookingMessage.set(msg);
        },
      });
  }

  guideAvatar(guide: Guide): string {
    return avatarUrl(fullName(guide.prenom, guide.nom));
  }

  artisanAvatar(artisan: Artisan): string {
    return avatarUrl(fullName(artisan.prenom, artisan.nom));
  }

  logout(): void {
    this.authService.logout();
  }

}





