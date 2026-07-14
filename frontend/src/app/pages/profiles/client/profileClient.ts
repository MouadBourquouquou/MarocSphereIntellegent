/* client-profile.ts */
import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  Directive,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
    if (!this.isBrowser) return; // no DOM on the server

    this.setupSmoothScroll();
    this.setupFormPreventDefault();
    this.onBrowserInit();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
  }

  /** Override for page-specific browser-only setup (charts, etc.) */
  protected onBrowserInit(): void {}

  private setupSmoothScroll(): void {
    const anchors = this.elRef.nativeElement.querySelectorAll<HTMLAnchorElement>(
      'a[href^="#"]'
    );

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
  imports: [],
  templateUrl: './profileClient.html',
  styleUrls: ['./profileClient.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class profileClient extends PageBehaviorsBase {
  showAllServices = signal(false);

  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(elRef: ElementRef<HTMLElement>, @Inject(PLATFORM_ID) platformId: object) {
    super(elRef, platformId);
  }

  toggleServices(): void {
    this.showAllServices.update((v) => !v);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId);
    }
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

    root.querySelectorAll<HTMLElement>('.tab-pane').forEach((pane) => {
      pane.classList.add('hidden');
    });

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

  saveDetails(event: Event): void {
    event.preventDefault();
    this.toggleEditMode(false);

    const toast = this.elRef.nativeElement.querySelector<HTMLElement>('#success-toast');
    if (!toast) return;

    toast.classList.remove('hidden');
    this.toastTimeoutId = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }
}