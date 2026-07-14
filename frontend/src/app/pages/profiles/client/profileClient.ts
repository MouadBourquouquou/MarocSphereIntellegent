import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  computed,
  inject,
  OnInit,
  Directive,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { AuthService } from '../../../services/auth.service';
import { ClientProfile, Itineraire, Reservation } from '../../../models/api.models';
import { fullName, avatarUrl } from '../../../utils/display.utils';
import { forkJoin } from 'rxjs';

@Directive()
export abstract class PageBehaviorsBase implements AfterViewInit, OnDestroy {
  protected isBrowser: boolean;
  protected cleanupFns: Array<() => void> = [];

  constructor(
    protected elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.setupSmoothScroll();
    this.setupFormPreventDefault();
    this.onBrowserInit();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
  }

  protected onBrowserInit(): void {}

  private setupSmoothScroll(): void {
    const anchors = this.elRef.nativeElement.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchors.forEach((anchor) => {
      const onClick = (e: Event): void => {
        const href = anchor.getAttribute('href');
        if (!href) return;
        const target = this.elRef.nativeElement.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      anchor.addEventListener('click', onClick);
      this.cleanupFns.push(() => anchor.removeEventListener('click', onClick));
    });
  }

  private setupFormPreventDefault(): void {
    const forms = this.elRef.nativeElement.querySelectorAll<HTMLFormElement>('form');
    forms.forEach((form) => {
      const onSubmit = (e: Event): void => e.preventDefault();
      form.addEventListener('submit', onSubmit);
      this.cleanupFns.push(() => form.removeEventListener('submit', onSubmit));
    });
  }
}

@Component({
  selector: 'app-client-profile',
  imports: [RouterLink],
  templateUrl: './profileClient.html',
  styleUrls: ['./profileClient.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class profileClient extends PageBehaviorsBase implements OnInit {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);

  isLoading = signal(true);
  errorMessage = signal('');
  client = signal<ClientProfile | null>(null);
  itineraires = signal<Itineraire[]>([]);
  reservations = signal<Reservation[]>([]);

  editNom = signal('');
  editPrenom = signal('');
  editTelephone = signal('');
  editNationalite = signal('');
  editLanguePreferee = signal('');

  isSaving = signal(false);
  showSuccessToast = signal(false);

  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  displayName = computed(() => {
    const profile = this.client();
    return profile ? fullName(profile.prenom, profile.nom) : 'Client';
  });

  avatar = computed(() => avatarUrl(this.displayName()));

  profileCompletion = computed(() => {
    const p = this.client();
    if (!p) return 0;
    let filled = 0;
    let total = 6;
    if (p.nom) filled++;
    if (p.prenom) filled++;
    if (p.email) filled++;
    if (p.telephone) filled++;
    if (p.nationalite) filled++;
    if (p.languePreferee) filled++;
    return Math.round((filled / total) * 100);
  });

  upcomingTrips = computed(() => this.reservations().filter((r) => r.statut === 'PENDING').length);
  completedTrips = computed(() => this.reservations().filter((r) => r.statut !== 'PENDING').length);
  aiItineraries = computed(() => this.itineraires().filter((i) => i.genereParIA).length);

  memberSince = computed(() => {
    const p = this.client();
    if (!p?.dateCreation) return '—';
    const d = new Date(p.dateCreation);
    return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  });

  constructor(elRef: ElementRef<HTMLElement>, @Inject(PLATFORM_ID) platformId: object) {
    super(elRef, platformId);
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.toastTimeoutId !== null) clearTimeout(this.toastTimeoutId);
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.clientService.getMe().subscribe({
      next: (profile) => {
        this.client.set(profile);
        this.resetEditFields(profile);
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
            this.errorMessage.set('Impossible de charger les données.');
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.errorMessage.set('Impossible de charger votre profil.');
        this.isLoading.set(false);
      },
    });
  }

  switchTab(tabId: string): void {
    const root = this.elRef.nativeElement;
    root.querySelectorAll<HTMLElement>('.tab-btn').forEach((btn) => {
      btn.classList.remove('bg-primary', 'text-primary-foreground', 'shadow-sm');
      btn.classList.add('text-muted-foreground', 'hover:text-foreground');
    });
    const activeBtn = root.querySelector<HTMLElement>(`#${tabId}-tab`);
    activeBtn?.classList.remove('text-muted-foreground', 'hover:text-foreground');
    activeBtn?.classList.add('bg-primary', 'text-primary-foreground', 'shadow-sm');
    root.querySelectorAll<HTMLElement>('.tab-pane').forEach((pane) => pane.classList.add('hidden'));
    root.querySelector<HTMLElement>(`#${tabId}-content`)?.classList.remove('hidden');
  }

  toggleEditMode(isEdit: boolean): void {
    const root = this.elRef.nativeElement;
    const viewGrid = root.querySelector<HTMLElement>('#details-view-grid');
    const editForm = root.querySelector<HTMLElement>('#details-edit-form');
    const editBtn = root.querySelector<HTMLElement>('#edit-details-btn');
    if (isEdit) {
      viewGrid?.classList.add('hidden');
      editForm?.classList.remove('hidden');
      editBtn?.classList.add('hidden');
    } else {
      viewGrid?.classList.remove('hidden');
      editForm?.classList.add('hidden');
      editBtn?.classList.remove('hidden');
    }
  }

  startEdit(): void {
    const p = this.client();
    if (p) this.resetEditFields(p);
    this.toggleEditMode(true);
  }

  cancelEdit(): void {
    this.toggleEditMode(false);
  }

  saveDetails(event: Event): void {
    event.preventDefault();
    const p = this.client();
    if (!p) return;

    this.isSaving.set(true);
    this.clientService.updateProfile(p.id, {
      nom: this.editNom(),
      prenom: this.editPrenom(),
      telephone: this.editTelephone(),
      nationalite: this.editNationalite(),
      languePreferee: this.editLanguePreferee(),
    }).subscribe({
      next: (updated) => {
        this.client.set(updated);
        this.isSaving.set(false);
        this.toggleEditMode(false);
        this.showSuccessToast.set(true);
        this.toastTimeoutId = setTimeout(() => this.showSuccessToast.set(false), 4000);
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set('Erreur lors de la mise à jour du profil.');
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private resetEditFields(p: ClientProfile): void {
    this.editNom.set(p.nom ?? '');
    this.editPrenom.set(p.prenom ?? '');
    this.editTelephone.set(p.telephone ?? '');
    this.editNationalite.set(p.nationalite ?? '');
    this.editLanguePreferee.set(p.languePreferee ?? '');
  }
}
