import {
  Directive, ElementRef, HostListener,
  inject, OnInit, OnDestroy, NgZone,
} from '@angular/core';

@Directive({ selector: '[glassCard]', standalone: true })
export class GlassCardDirective implements OnInit, OnDestroy {
  private readonly el   = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);

  private readonly MAX_TILT     = 10;
  private readonly LIFT_PX      = 18;
  private readonly SCALE        = 1.022;
  private readonly IMG_PARALLAX = 7;
  private readonly EASE_IN  = 'transform 0.10s ease, box-shadow 0.10s ease';
  private readonly EASE_OUT =
    'transform 0.55s cubic-bezier(0.23,1,0.32,1), ' +
    'box-shadow 0.55s cubic-bezier(0.23,1,0.32,1)';

  private rafId    = 0;
  private hovered  = false;
  private reduced  = false;
  private touch    = false;
  private glowEl!:   HTMLElement;
  private borderEl!: HTMLElement;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.touch   = window.matchMedia('(hover: none)').matches;
    if (this.reduced || this.touch) return;
    this.prepareHost();
    this.createGlow();
    this.createBorder();
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  @HostListener('mouseenter')
  onEnter(): void {
    if (this.reduced || this.touch) return;
    this.hovered = true;
    this.el.nativeElement.style.transition = this.EASE_IN;
    this.glowEl.style.opacity              = '1';
    this.borderEl.style.opacity            = '1';
  }

  @HostListener('mouseleave')
  onLeave(): void {
    if (this.reduced || this.touch) return;
    this.hovered = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    const h = this.el.nativeElement;
    h.style.transition = this.EASE_OUT;
    h.style.transform  =
      'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    h.style.boxShadow  = this.shadowBase();
    this.glowEl.style.opacity   = '0';
    this.borderEl.style.opacity = '0';
    const img = h.querySelector('img') as HTMLElement | null;
    if (img) {
      img.style.transition = this.EASE_OUT;
      img.style.transform  = 'scale(1.04) translate(0px,0px)';
    }
  }

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    if (this.reduced || this.touch || !this.hovered) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const mx = e.clientX, my = e.clientY;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(() => this.tick(rect, mx, my));
    });
  }

  private tick(rect: DOMRect, mx: number, my: number): void {
    const h  = this.el.nativeElement;
    const nx = ((mx - rect.left) / rect.width  - 0.5) * 2;
    const ny = ((my - rect.top)  / rect.height - 0.5) * 2;
    const rotY =  nx * this.MAX_TILT;
    const rotX = -ny * this.MAX_TILT;
    const sx    = -rotY * 1.4;
    const sy    =  rotX * 1.4 + 22;
    const sBlur = 36 + (Math.abs(nx) + Math.abs(ny)) * 16;
    const sA    = 0.20 + (Math.abs(nx) + Math.abs(ny)) * 0.035;
    h.style.transform =
      `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) ` +
      `translateY(-${this.LIFT_PX}px) scale(${this.SCALE})`;
    h.style.boxShadow =
      `${sx}px ${sy}px ${sBlur}px rgba(157,62,38,${sA}), ` +
      `0 4px 14px rgba(0,0,0,0.07)`;
    const gx = ((mx - rect.left) / rect.width)  * 100;
    const gy = ((my - rect.top)  / rect.height) * 100;
    this.glowEl.style.background =
      `radial-gradient(circle at ${gx}% ${gy}%, ` +
      `rgba(157,62,38,0.13) 0%, transparent 62%)`;
    const img = h.querySelector('img') as HTMLElement | null;
    if (img) {
      img.style.transition = 'transform 0.10s ease';
      img.style.transform  =
        `scale(1.08) translate(${-nx * this.IMG_PARALLAX}px,` +
        `${-ny * this.IMG_PARALLAX}px)`;
    }
  }

  private prepareHost(): void {
    const h = this.el.nativeElement;
    h.style.position       = 'relative';
    h.style.willChange     = 'transform, box-shadow';
    h.style.boxShadow      = this.shadowBase();
    h.style.transition     = this.EASE_OUT;
    h.style.transformStyle = 'preserve-3d';
    if (window.getComputedStyle(h).overflow === 'visible')
      h.style.overflow = 'hidden';
  }

  private createGlow(): void {
    const el = document.createElement('div');
    el.setAttribute('aria-hidden', 'true');
    Object.assign(el.style, {
      position: 'absolute', inset: '0', borderRadius: 'inherit',
      opacity: '0', transition: 'opacity 0.3s ease',
      pointerEvents: 'none', zIndex: '1',
    });
    this.el.nativeElement.appendChild(el);
    this.glowEl = el;
  }

  private createBorder(): void {
    const el = document.createElement('div');
    el.setAttribute('aria-hidden', 'true');
    Object.assign(el.style, {
      position: 'absolute', inset: '0', borderRadius: 'inherit',
      opacity: '0', transition: 'opacity 0.4s ease',
      pointerEvents: 'none', zIndex: '2', padding: '1.5px',
      background:
        'linear-gradient(135deg,' +
        ' rgba(157,62,38,0.65) 0%,' +
        ' rgba(0,98,51,0.45) 50%,' +
        ' rgba(157,62,38,0.65) 100%)',
      WebkitMask:
        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    } as any);
    this.el.nativeElement.appendChild(el);
    this.borderEl = el;
  }

  private shadowBase(): string {
    return '0 6px 28px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)';
  }
}
