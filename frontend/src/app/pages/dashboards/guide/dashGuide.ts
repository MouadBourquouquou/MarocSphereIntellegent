import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  computed,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GuideService } from '../../../services/guide.service';
import { ExperienceService } from '../../../services/experience.service';
import { GuideReservationService } from '../../../services/guide-reservation.service';
import { GuideMessageService } from '../../../services/guide-message.service';
import { AvisService } from '../../../services/avis.service';
import { AuthService } from '../../../services/auth.service';
import { Guide, Experience as ApiExperience, GuideReservation, GuideConversation, GuideMessage, Avis } from '../../../models/api.models';

export type WorkspacePage = 'profile' | 'experiences' | 'requests' | 'messages' | 'availability';

export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  price: string;
  category: string;
  image: string;
  rating: number;
  bookings: number;
  status: 'published' | 'draft';
}

export interface BookingRequest {
  id: string;
  travelerName: string;
  travelerAvatar: string;
  travelerCountry: string;
  travelerEmail: string;
  travelerPhone: string;
  experience: string;
  guests: number;
  date: string;
  specialNote: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  status: 'pending' | 'accepted' | 'cancelled' | 'completed';
}

export interface Conversation {
  id: string;
  travelerName: string;
  travelerAvatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: string;
  from: 'me' | 'them';
  content: string;
  time: string;
  read: boolean;
}

export interface CalendarDay {
  date: Date;
  iso: string;
  label: string;
  day: number;
  weekday: number;
  status: 'past' | 'today' | 'available' | 'booked' | 'blocked' | 'selected';
  reservations: BookingRequest[];
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  text: string;
  authorCountry: string;
}

@Component({
  selector: 'app-dash-guide',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashGuide.html',
  styleUrls: ['./dashGuide.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class dashGuide implements AfterViewInit, OnDestroy {
  private guideService = inject(GuideService);
  private experienceService = inject(ExperienceService);
  private reservationService = inject(GuideReservationService);
  private messageService = inject(GuideMessageService);
  private avisService = inject(AvisService);
  private authService = inject(AuthService);

  activePage = signal<WorkspacePage>('profile');

  guide               = signal<Guide | null>(null);
  guideName           = signal('');
  guidePrenom         = signal('');
  guideEmail          = signal('');
  telephone           = signal('');
  nationalite         = signal('');
  languePreferee      = signal('');
  numeroLicence       = signal('');
  statutCertification = signal('PENDING');
  scoreCertification  = signal(0);
  disponible          = signal(true);
  isLoading           = signal(true);
  isSaving            = signal(false);
  isEditing           = signal(false);

  notificationMessage = signal('');
  notificationType    = signal<'success' | 'error'>('success');
  showNotification    = signal(false);

  experienceFilter   = signal<'all' | 'published' | 'draft'>('all');
  experienceSearch   = signal('');
  showDropdownId     = signal<string | null>(null);

  showCreateExperience = signal(false);
  isCreatingExperience = signal(false);
  newExpTitle       = signal('');
  newExpDescription = signal('');
  newExpLocation    = signal('');
  newExpDuration    = signal('');
  newExpPrice       = signal('');
  newExpCategory    = signal('Cultural');
  newExpImage       = signal('');
  newExpStatus      = signal('DRAFT');

  experiences = signal<Experience[]>([]);

  filteredExperiences = computed(() => {
    let list = this.experiences();
    const filter = this.experienceFilter();
    const search = this.experienceSearch().toLowerCase();
    if (filter !== 'all') list = list.filter(e => e.status === filter);
    if (search)           list = list.filter(e =>
      e.title.toLowerCase().includes(search) ||
      e.location.toLowerCase().includes(search)
    );
    return list;
  });

  requestFilter = signal<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all');
  requests = signal<BookingRequest[]>([]);

  filteredRequests = computed(() => {
    const filter = this.requestFilter();
    if (filter === 'all') return this.requests();
    return this.requests().filter(r => r.status === filter);
  });

  activeConversationId = signal<string | null>(null);
  mobileChatOpen       = signal(false);
  messageInput         = signal('');
  conversationSearch   = signal('');

  conversations = signal<Conversation[]>([]);
  messages = signal<Record<string, Message[]>>({});

  activeConversation = computed(() =>
    this.conversations().find(c => c.id === this.activeConversationId()) ?? null
  );

  activeMessages = computed(() =>
    this.messages()[this.activeConversationId() ?? ''] ?? []
  );

  activeConversationRequest = computed(() =>
    this.requests().find(r =>
      r.travelerName === this.activeConversation()?.travelerName
    ) ?? null
  );

  filteredConversations = computed(() => {
    const search = this.conversationSearch().toLowerCase();
    if (!search) return this.conversations();
    return this.conversations().filter(c =>
      c.travelerName.toLowerCase().includes(search)
    );
  });

  reviews = signal<Review[]>([]);

  currentMonthIndex = signal(0);
  calendarFilter    = signal<'all' | 'available' | 'booked' | 'blocked' | 'upcoming' | 'completed'>('all');
  selectedDates     = signal<string[]>([]);
  selectedDate      = signal<string | null>(null);
  selectedNote      = signal('');
  dateNotes         = signal<Record<string, string>>({});
  blockedDates      = signal<string[]>(['2026-10-09']);
  availableDates    = signal<string[]>(['2026-10-16', '2026-10-18']);
  calendarSynced    = signal(false);

  private today = new Date();
  todayIso = computed(() => this.toIsoDate(this.today));

  months = computed(() => {
    const months: Date[] = [];
    const start = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    for (let i = 0; i < 10; i++) months.push(new Date(start.getFullYear(), start.getMonth() + i, 1));
    return months;
  });

  selectedMonth = computed(() => this.months()[this.currentMonthIndex()]);

  calendarReservations = computed(() => {
    const map = new Map<string, BookingRequest[]>();
    this.requests().forEach(r => {
      const iso = this.toIsoDate(r.date);
      if (!map.has(iso)) map.set(iso, []);
      map.get(iso)!.push(r);
    });
    return map;
  });

  bookedDateSet = computed(() => {
    const s = new Set<string>();
    this.requests().forEach(r => {
      if (r.status === 'accepted' || r.status === 'completed') s.add(this.toIsoDate(r.date));
    });
    return s;
  });

  monthCalendar = computed((): (CalendarDay | null)[] => {
    const monthStart    = this.selectedMonth();
    const year          = monthStart.getFullYear();
    const month         = monthStart.getMonth();
    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth   = new Date(year, month + 1, 0).getDate();
    const totalSlots    = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

    return Array.from({ length: totalSlots }, (_, idx) => {
      const dayNumber = idx - firstDayOfWeek + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) return null;
      const date = new Date(year, month, dayNumber);
      const iso  = this.toIsoDate(date);
      const reservations = this.calendarReservations().get(iso) ?? [];
      return {
        date, iso,
        label: dayNumber.toString(),
        day: dayNumber,
        weekday: date.getDay(),
        status: this.calculateDayStatus(date, iso),
        reservations,
      } as CalendarDay;
    });
  });

  private isBrowser: boolean;
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private cleanupFns: Array<() => void> = [];

  constructor(
    private elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    this.loadGuide();
    if (!this.isBrowser) return;
    this.setupSmoothScroll();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach(fn => fn());
    if (this.toastTimeoutId !== null) clearTimeout(this.toastTimeoutId);
  }

  navigate(page: WorkspacePage): void {
    this.activePage.set(page);
    if (page === 'experiences') this.loadExperiences();
    if (page === 'requests') this.loadRequests();
    if (page === 'messages') this.loadConversations();
    if (page === 'availability') this.loadRequests();
  }

  private loadGuide(): void {
    this.guideService.getMe().subscribe({
      next: g => {
        this.guide.set(g);
        this.guideName.set(g.nom ?? '');
        this.guidePrenom.set(g.prenom ?? '');
        this.guideEmail.set(g.email ?? '');
        this.telephone.set(g.telephone ?? '');
        this.nationalite.set(g.nationalite ?? '');
        this.languePreferee.set(g.languePreferee ?? '');
        this.numeroLicence.set(g.numeroLicence ?? '');
        this.statutCertification.set(g.statutCertification ?? 'PENDING');
        this.scoreCertification.set(g.scoreCertification ?? 0);
        this.disponible.set(g.disponible ?? true);
        this.isLoading.set(false);
        this.loadExperiences();
        this.loadRequests();
        this.loadConversations();
        this.loadReviews();
      },
      error: () => {
        this.notify('Failed to load profile.', 'error');
        this.isLoading.set(false);
      },
    });
  }

  toggleEditMode(edit: boolean): void {
    this.isEditing.set(edit);
    if (!edit) {
      const g = this.guide();
      if (g) {
        this.guideName.set(g.nom ?? '');
        this.guidePrenom.set(g.prenom ?? '');
        this.telephone.set(g.telephone ?? '');
        this.nationalite.set(g.nationalite ?? '');
        this.languePreferee.set(g.languePreferee ?? '');
        this.numeroLicence.set(g.numeroLicence ?? '');
      }
    }
  }

  saveDetails(event: Event): void {
    event.preventDefault();
    const g = this.guide();
    if (!g) return;
    this.isSaving.set(true);
    this.guideService.updateProfile(g.id!, {
      nom: this.guideName(), prenom: this.guidePrenom(),
      telephone: this.telephone(), nationalite: this.nationalite(),
      languePreferee: this.languePreferee(), numeroLicence: this.numeroLicence(),
    }).subscribe({
      next: updated => {
        this.guide.set(updated);
        this.guideName.set(updated.nom ?? '');
        this.guidePrenom.set(updated.prenom ?? '');
        this.telephone.set(updated.telephone ?? '');
        this.nationalite.set(updated.nationalite ?? '');
        this.languePreferee.set(updated.languePreferee ?? '');
        this.numeroLicence.set(updated.numeroLicence ?? '');
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.notify('Profile updated.', 'success');
      },
      error: () => { this.isSaving.set(false); this.notify('Update failed.', 'error'); },
    });
  }

  toggleAvailability(): void {
    const g = this.guide();
    if (!g) return;
    const newVal = !this.disponible();
    this.guideService.updateProfile(g.id!, { disponible: newVal }).subscribe({
      next: () => {
        this.disponible.set(newVal);
        this.notify(newVal ? 'You are now available for bookings.' : 'You are now unavailable.', 'success');
      },
      error: () => this.notify('Failed to update availability.', 'error'),
    });
  }

  logout(): void { this.authService.logout(); }

  // ── Experiences ───────────────────────────────────────────────────────────
  private loadExperiences(): void {
    this.experienceService.getMyExperiences().subscribe({
      next: list => this.experiences.set(list.map(e => this.mapExperience(e))),
      error: () => this.notify('Failed to load experiences.', 'error'),
    });
  }

  private mapExperience(e: ApiExperience): Experience {
    return {
      id: e.id.toString(),
      title: e.title ?? '',
      description: e.description ?? '',
      location: e.location ?? '',
      duration: e.duration ?? '',
      price: e.price.toString() ?? '',
      category: e.category ?? '',
      image: e.image ?? '/images/Unique Marrakech Itinerary_ Hidden Gems & Highlights.jpg',
      rating: e.note ?? 0,
      bookings: e.reservationsNumber ?? 0,
      status: e.statut === 'PUBLISHED' ? 'published' : 'draft',
    };
  }

  toggleExperienceStatus(id: string): void {
    const numId = parseInt(id, 10);
    this.experienceService.toggleStatus(numId).subscribe({
      next: updated => {
        this.experiences.update(list => list.map(e =>
          e.id === id ? { ...e, status: updated.statut === 'PUBLISHED' ? 'published' : 'draft' } : e
        ));
        this.notify('Status updated.', 'success');
      },
      error: () => this.notify('Failed to update status.', 'error'),
    });
  }

  deleteExperience(id: string): void {
    const numId = parseInt(id, 10);
    this.experienceService.delete(numId).subscribe({
      next: () => {
        this.experiences.update(list => list.filter(e => e.id !== id));
        this.notify('Experience deleted.', 'success');
      },
      error: () => this.notify('Failed to delete experience.', 'error'),
    });
  }

  toggleDropdown(id: string): void {
    this.showDropdownId.update(v => v === id ? null : id);
  }

  openCreateExperience(): void {
    this.newExpTitle.set('');
    this.newExpDescription.set('');
    this.newExpLocation.set('');
    this.newExpDuration.set('');
    this.newExpPrice.set('');
    this.newExpCategory.set('Cultural');
    this.newExpImage.set('');
    this.newExpStatus.set('DRAFT');
    this.showCreateExperience.set(true);
  }

  closeCreateExperience(): void {
    this.showCreateExperience.set(false);
  }

  createExperience(event: Event): void {
    event.preventDefault();
    if (!this.newExpTitle().trim() || !this.newExpDescription().trim()) {
      this.notify('Title and description are required.', 'error');
      return;
    }
    this.isCreatingExperience.set(true);
    this.experienceService.create({
      titre: this.newExpTitle(),
      description: this.newExpDescription(),
      localisation: this.newExpLocation(),
      duree: this.newExpDuration(),
      prix: this.newExpPrice(),
      categorie: this.newExpCategory(),
      image: this.newExpImage(),
      statut: this.newExpStatus(),
    }).subscribe({
      next: (created) => {
        this.experiences.update(list => [this.mapExperience(created), ...list]);
        this.closeCreateExperience();
        this.isCreatingExperience.set(false);
        this.notify('Experience created.', 'success');
      },
      error: () => {
        this.isCreatingExperience.set(false);
        this.notify('Failed to create experience.', 'error');
      },
    });
  }

  // ── Requests ──────────────────────────────────────────────────────────────
  private loadRequests(): void {
    const g = this.guide();
    if (!g) return;
    this.reservationService.getByGuideId(g.id!).subscribe({
      next: list => this.requests.set(list.map(r => this.mapReservation(r))),
      error: () => this.notify('Failed to load requests.', 'error'),
    });
  }

  private mapReservation(r: GuideReservation): BookingRequest {
    const firstName = r.clientPrenom ?? '';
    const lastName = r.clientNom ?? '';
    const fullName = `${firstName} ${lastName}`.trim() || `Client #${r.clientId}`;
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'CL';
    return {
      id: r.id.toString(),
      travelerName: fullName,
      travelerAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=B03A22&color=fff&size=128`,
      travelerCountry: r.clientNationalite ?? 'Morocco',
      travelerEmail: r.clientEmail ?? '',
      travelerPhone: r.clientTelephone ?? '',
      experience: 'Guided Experience',
      guests: 1,
      date: r.date ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
      specialNote: '',
      paymentStatus: r.statut === 'CONFIRMED' ? 'paid' : 'pending',
      status: this.mapReservationStatus(r.statut),
    };
  }

  private mapReservationStatus(statut: string): BookingRequest['status'] {
    switch (statut?.toUpperCase()) {
      case 'CONFIRMED': return 'accepted';
      case 'COMPLETED': return 'completed';
      case 'CANCELLED': return 'cancelled';
      default: return 'pending';
    }
  }

  acceptRequest(id: string): void {
    const numId = parseInt(id, 10);
    this.reservationService.updateStatut(numId, 'CONFIRMED').subscribe({
      next: () => {
        this.requests.update(list => list.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
        this.notify('Request accepted.', 'success');
      },
      error: () => this.notify('Failed to accept request.', 'error'),
    });
  }

  declineRequest(id: string): void {
    const numId = parseInt(id, 10);
    this.reservationService.updateStatut(numId, 'CANCELLED').subscribe({
      next: () => {
        this.requests.update(list => list.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
        this.notify('Request declined.', 'success');
      },
      error: () => this.notify('Failed to decline request.', 'error'),
    });
  }

  completeRequest(id: string): void {
    const numId = parseInt(id, 10);
    this.reservationService.updateStatut(numId, 'COMPLETED').subscribe({
      next: () => {
        this.requests.update(list => list.map(r => r.id === id ? { ...r, status: 'completed' } : r));
        this.notify('Marked as completed.', 'success');
      },
      error: () => this.notify('Failed to complete request.', 'error'),
    });
  }

  messageGuest(req: BookingRequest): void {
    const conv = this.conversations().find(c => c.travelerName === req.travelerName);
    if (conv) {
      this.activeConversationId.set(conv.id);
      this.navigate('messages');
    }
  }

  // ── Messages ──────────────────────────────────────────────────────────────
  private loadConversations(): void {
    this.messageService.getConversations().subscribe({
      next: list => {
        const convs = list.map(c => this.mapConversation(c));
        this.conversations.set(convs);
        if (convs.length > 0 && !this.activeConversationId()) {
          this.activeConversationId.set(convs[0].id);
          this.loadMessages(convs[0].id);
        }
      },
      error: () => this.notify('Failed to load conversations.', 'error'),
    });
  }

  private mapConversation(c: GuideConversation): Conversation {
    const fullName = `${c.clientPrenom ?? ''} ${c.clientNom ?? ''}`.trim() || `Client #${c.clientId}`;
    return {
      id: c.id.toString(),
      travelerName: fullName,
      travelerAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=B03A22&color=fff&size=128`,
      lastMessage: c.dernierMessage ?? '',
      time: c.dateDernierMessage
        ? new Date(c.dateDernierMessage).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        : '',
      unread: c.messagesNonLus ?? 0,
      online: false,
    };
  }

  selectConversation(id: string): void {
    this.activeConversationId.set(id);
    this.mobileChatOpen.set(true);
    this.conversations.update(list => list.map(c => c.id === id ? { ...c, unread: 0 } : c));
    this.loadMessages(id);
  }

  backToConversations(): void {
    this.mobileChatOpen.set(false);
  }

  private loadMessages(conversationId: string): void {
    const numId = parseInt(conversationId, 10);
    this.messageService.getMessages(numId).subscribe({
      next: list => {
        const msgs = list.map(m => ({
          id: m.id.toString(),
          from: m.role === 'USER' ? 'me' as const : 'them' as const,
          content: m.contenu ?? '',
          time: m.dateEnvoi
            ? new Date(m.dateEnvoi).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            : '',
          read: true,
        }));
        this.messages.update(all => ({ ...all, [conversationId]: msgs }));
      },
      error: () => this.notify('Failed to load messages.', 'error'),
    });
  }

  sendMessage(): void {
    const text = this.messageInput().trim();
    if (!text) return;
    const convId = this.activeConversationId();
    if (!convId) return;
    const numConvId = parseInt(convId, 10);

    this.messageService.sendMessage({ conversationId: numConvId, contenu: text }).subscribe({
      next: (saved) => {
        const msg: Message = {
          id: saved.id.toString(),
          from: 'me',
          content: text,
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          read: true,
        };
        this.messages.update(all => ({
          ...all,
          [convId]: [...(all[convId] ?? []), msg],
        }));
        this.conversations.update(list => list.map(c =>
          c.id === convId ? { ...c, lastMessage: text, time: msg.time } : c
        ));
        this.messageInput.set('');
      },
      error: () => this.notify('Failed to send message.', 'error'),
    });
  }

  onMessageKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // ── Reviews ──────────────────────────────────────────────────────────────
  private loadReviews(): void {
    const g = this.guide();
    if (!g) return;
    this.avisService.getByGuideId(g.id!).subscribe({
      next: list => {
        this.reviews.set(list.map(a => ({
          id: a.id.toString(),
          authorName: `Traveler #${a.auteurId}`,
          authorAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
          rating: a.note ?? 5,
          text: a.commentaire ?? '',
          authorCountry: 'Morocco',
        })));
      },
      error: () => {},
    });
  }

  // ── Calendar ──────────────────────────────────────────────────────────────
  onMonthPrev(): void { this.currentMonthIndex.update(v => Math.max(0, v - 1)); }
  onMonthNext(): void { this.currentMonthIndex.update(v => Math.min(this.months().length - 1, v + 1)); }

  toggleDateSelection(iso: string): void {
    if (this.toIsoDate(this.today) > iso) return;
    this.selectedDates.update(curr =>
      curr.includes(iso) ? curr.filter(i => i !== iso) : [...curr, iso]
    );
  }

  clearSelection(): void { this.selectedDates.set([]); this.selectedDate.set(null); }

  markSelectedAsBlocked(): void {
    const sel = this.selectedDates();
    if (!sel.length) { this.notify('Select dates first.', 'error'); return; }
    this.blockedDates.update(d => Array.from(new Set([...d, ...sel])));
    this.selectedDates.set([]);
    this.notify('Dates blocked.', 'success');
  }

  markSelectedAsAvailable(): void {
    const sel = this.selectedDates();
    if (!sel.length) { this.notify('Select dates first.', 'error'); return; }
    this.blockedDates.update(d => d.filter(i => !sel.includes(i)));
    this.availableDates.update(d => Array.from(new Set([...d, ...sel])));
    this.selectedDates.set([]);
    this.notify('Dates marked available.', 'success');
  }

  syncCalendar(): void {
    this.calendarSynced.update(v => !v);
    this.notify(this.calendarSynced() ? 'Calendar synced.' : 'Sync paused.', 'success');
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  toIsoDate(value: string | Date): string {
    const d = typeof value === 'string' ? new Date(value) : value;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  getBookingsForDate(iso: string): BookingRequest[] {
    return this.calendarReservations().get(iso) ?? [];
  }

  formatMonthLabel(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  calculateDayStatus(date: Date, iso: string): CalendarDay['status'] {
    const todayIso = this.toIsoDate(this.today);
    if (iso < todayIso)                           return 'past';
    if (this.selectedDates().includes(iso))       return 'selected';
    if (this.blockedDates().includes(iso))        return 'blocked';
    if (this.bookedDateSet().has(iso))            return 'booked';
    if (iso === todayIso)                         return 'today';
    return 'available';
  }

  guideInitials = computed(() =>
    `${this.guidePrenom().charAt(0)}${this.guideName().charAt(0)}`.toUpperCase() || 'MG'
  );

  pendingCount = computed(() => this.requests().filter(r => r.status === 'pending').length);
  unreadTotal  = computed(() => this.conversations().reduce((sum, c) => sum + c.unread, 0));
  averageRating = computed(() => {
    const revs = this.reviews();
    if (revs.length === 0) return 0;
    return revs.reduce((sum, r) => sum + r.rating, 0) / revs.length;
  });

  nextUpcomingBooking = computed(() => {
    const today = this.toIsoDate(this.today);
    return this.requests()
      .filter(r => (r.status === 'accepted' || r.status === 'pending') && this.toIsoDate(r.date) >= today)
      .sort((a, b) => this.toIsoDate(a.date).localeCompare(this.toIsoDate(b.date)))
      [0] ?? null;
  });

  notify(message: string, type: 'success' | 'error'): void {
    this.notificationMessage.set(message);
    this.notificationType.set(type);
    this.showNotification.set(true);
    if (this.toastTimeoutId !== null) clearTimeout(this.toastTimeoutId);
    this.toastTimeoutId = setTimeout(() => this.showNotification.set(false), 4000);
  }

  private setupSmoothScroll(): void {
    this.elRef.nativeElement.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(a => {
      const fn = (e: Event) => {
        const target = this.elRef.nativeElement.querySelector<HTMLElement>(a.getAttribute('href')!);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      };
      a.addEventListener('click', fn);
      this.cleanupFns.push(() => a.removeEventListener('click', fn));
    });
  }
}
