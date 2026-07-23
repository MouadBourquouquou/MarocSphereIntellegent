import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  OnInit,
  AfterViewInit,
  signal,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { ClientService } from '../../../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { ClientProfile } from '../../../../models/api.models';
import { avatarUrl, fullName } from '../../../../utils/display.utils';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-favourites',
  imports: [RouterLink],
  templateUrl: './favourites.html',
  styleUrls: ['./favourites.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class favourites implements OnInit, AfterViewInit {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);
  private isBrowser: boolean;
  private cleanupFns: Array<() => void> = [];

  isLoading = signal(true);
  errorMessage = signal('');
  searchQuery = signal('');

  client = signal<ClientProfile | null>(null);

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  displayName = computed(() => {
    const profile = this.client();
    return profile ? fullName(profile.prenom, profile.nom) : 'Client';
  });

  avatar = computed(() => avatarUrl(this.displayName()));

  ngOnInit(): void {
    this.loadClient();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.setupSmoothScroll();
    this.setupFormPreventDefault();
  }

  loadClient(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.clientService.getMe().subscribe({
      next: (profile) => {
        this.client.set(profile);
        this.isLoading.set(false);
        // TODO: once you have a favourites/saved-items service, load the
        // list here the same way marketplace.ts loads artisans/guides.
      },
      error: () => {
        this.errorMessage.set(
          'Connectez-vous avec un compte client pour accéder à vos favoris.',
        );
        this.isLoading.set(false);
      },
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  logout(): void {
    this.authService.logout();
  }

  private setupSmoothScroll(): void {
    const anchors = this.elRef.nativeElement.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchors.forEach((anchor) => {
      const onClick = (event: Event): void => {
        const href = anchor.getAttribute('href');
        if (!href) return;
        const target = this.elRef.nativeElement.querySelector<HTMLElement>(href);
        if (target) {
          event.preventDefault();
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
      const onSubmit = (event: Event): void => {
        event.preventDefault();
      };
      form.addEventListener('submit', onSubmit);
      this.cleanupFns.push(() => form.removeEventListener('submit', onSubmit));
    });
  }

  onFormSubmit(event: Event): void {
    event.preventDefault();
  }

  scrollToSection(targetId: string, event?: Event): void {
    event?.preventDefault();
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleElementById(elementId: string): void {
    const el = document.getElementById(elementId);
    if (!el) return;
    const isHidden = el.style.display === 'none';
    this.renderer.setStyle(el, 'display', isHidden ? '' : 'none');
  }
}