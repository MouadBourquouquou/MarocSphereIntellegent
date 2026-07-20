import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed, OnInit, OnDestroy, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlassCardDirective } from '../../directives/glass-card.directive';

@Component({
  selector: 'app-landing-page',
  imports: [FormsModule, GlassCardDirective],
  templateUrl: './landingpage.html',
  styleUrls: ['./swipers.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPage implements OnInit, OnDestroy, AfterViewInit {
  showAllServices = signal(false);

  // Auto-Slideshow State
  heroSlides = [
    '/images/Casbah Ait Benhaddou, Morocco Stock Image - Image….jpg', // kasbah
    '/images/Entrée Magique d’un Riad Marocain à Marrakech _ Élégance Intemporelle.jpg', // arch/flowers
    '/images/Men walking through Moroccan desert.jpg' // desert camp
  ];
  activeSlideIndex = signal(0);
  private heroSlideTimer: any;

  // Stats signals for animated count-ups
  statsGuides = signal(0);
  statsArtisans = signal(0);
  statsCities = signal(0);
  statsItineraries = signal(0);
  private hasAnimatedStats = false;

  // Blog categories & filter
  selectedBlogCategory = signal('All');
  blogCurrentIndex = signal(0);
  blogs = [
    {
      category: 'Tourism',
      date: 'Jun 12, 2026',
      title: 'How AI is reshaping personalized travel in Morocco',
      description: 'Discover how itinerary engines and local data can create richer, safer journeys across cities and regions.',
      author: 'MarocSphere Editorial',
      image: '/images/morocco.jpg',
      link: '#'
    },
    {
      category: 'Moroccan Heritage',
      date: 'Jun 03, 2026',
      title: 'Why traceable artisan commerce matters for local communities',
      description: 'From QR proof to export badges, transparency builds trust for global buyers and Moroccan makers alike.',
      author: 'Leila Benkirane',
      image: '/images/Men walking through Moroccan desert.jpg',
      link: '#'
    },
    {
      category: 'Culture',
      date: 'May 27, 2026',
      title: 'The new generation of certified local guides',
      description: 'Explore how language skills, digital reservations, and verified credentials elevate the traveler experience.',
      author: 'Omar Tazi',
      image: '/images/Marrakech Nights_ Jemaa el-Fna at Twilight.jpg',
      link: '#'
    }
  ];

  filteredBlogs = computed(() => {
    const category = this.selectedBlogCategory();
    if (category === 'All') return this.blogs;
    return this.blogs.filter(blog => blog.category.toLowerCase() === category.toLowerCase());
  });

  // Experiences wishlist
  wishlist = signal<Record<string, boolean>>({});

  // Interactive map experiences
  selectedExperienceId = signal<string>('marrakech');
  experiences = [
    {
      id: 'marrakech',
      title: 'Marrakech Rooftop Evenings',
      location: 'Marrakech',
      subtitle: 'Luxury Medina Experience',
      description: 'Fine dining, medina stories, and sunset views over the old city. A sensory journey through terracotta rooftops and golden light.',
      duration: '4 hours',
      price: '890 MAD',
      rating: '4.9',
      image: '/images/Marrakech Nights_ Jemaa el-Fna at Twilight.jpg'
    },
    {
      id: 'sahara',
      title: 'Sahara Dunes Escape',
      location: 'Merzouga',
      subtitle: 'Luxury Desert Experience',
      description: 'Camel ride through endless dunes, luxury desert camp, and Berber music under a canopy of desert stars.',
      duration: '2 days',
      price: '2,900 MAD',
      rating: '4.8',
      image: '/images/Men walking through Moroccan desert.jpg'
    },
    {
      id: 'chefchaouen',
      title: 'Blue City Discovery',
      location: 'Chefchaouen',
      subtitle: 'Cultural Immersion',
      description: 'Wander through sapphire-blue alleyways, meet local artisans, and discover panoramic viewpoints over the Rif Mountains.',
      duration: '1 day',
      price: '1,150 MAD',
      rating: '4.7',
      image: '/images/Chefchaouen,.jpg'
    },
    {
      id: 'atlas',
      title: 'High Atlas Expedition',
      location: 'Atlas Mountains',
      subtitle: 'Mountain Adventure',
      description: 'Trek through Berber villages, cross dramatic valleys, and witness panoramic mountain landscapes at golden hour.',
      duration: '3 days',
      price: '3,200 MAD',
      rating: '4.9',
image: '/images/Atlas.jpg'
    },
    {
      id: 'essaouira',
      title: 'Atlantic Coastal Retreat',
      location: 'Essaouira',
      subtitle: 'Seaside Serenity',
      description: 'Windswept ramparts, fresh seafood markets, and golden beach walks along the Atlantic coast.',
      duration: '1 day',
      price: '650 MAD',
      rating: '4.8',
      image: '/images/Essaouira.jpg'
    },
    {
      id: 'ouarzazate',
      title: 'Kasbah & Cinema Roads',
      location: 'Ouarzazate',
      subtitle: 'Heritage Discovery',
      description: 'Explore dramatic gorges, ancient kasbahs, and legendary film studios at the gateway to the Sahara.',
      duration: '2 days',
      price: '1,400 MAD',
      rating: '4.6',
      image: '/images/Casbah Ait Benhaddou, Morocco Stock Image - Image….jpg'
    }
  ];

  get selectedExperience() {
    return this.experiences.find(e => e.id === this.selectedExperienceId())!;
  }

  selectExperience(id: string): void {
    this.selectedExperienceId.set(id);
  }

  // Custom Testimonials auto-rotation with progress bar
  testimonials = [
    {
      quote: '“The AI planner saved hours of research and connected us with an amazing guide in Fez. Every reservation felt secure and seamless.”',
      author: 'Sophia Martin',
      role: 'Client · France',
      rating: '5.0'
    },
    {
      quote: '“As an artisan, MarocSphere gives my work visibility, trust, and direct connection with travelers who value authenticity.”',
      author: 'Amina El Fassi',
      role: 'Artisan · Fez',
      rating: '4.9'
    }
  ];
  currentTestimonialIndex = signal(0);
  testimonialProgress = signal(0);
  isTestimonialPaused = false;
  private testimonialTimer: any;
  private progressTimer: any;

  // Newsletter Success State
  newsletterEmail = signal('');
  newsletterSuccess = signal(false);

  // Sticky navbar state
  isScrolled = signal(false);

  // ─── Crazy Hover: Service Card Premium Interaction ───
  private isTouchDevice = false;
  private prefersReducedMotion = false;
  private pendingRafId: number | null = null;
  private pendingMouseMove: { card: HTMLElement; x: number; y: number } | null = null;
  private activeCardEl: HTMLElement | null = null;

  // References to DOM elements
  private statsSection = viewChild<ElementRef>('statsSection');

  ngOnInit(): void {
    // Detect touch device and reduced-motion preference
    if (typeof window !== 'undefined') {
      this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.addEventListener('scroll', this.onScrollListener);

      // Mouse micro-interactions for hero (Morocco text, palms)
      if (!this.isTouchDevice && !this.prefersReducedMotion) {
        document.addEventListener('mousemove', this.onHeroMouseMove);
      }
    }

    // 1. Start Auto-Slideshow Timer (5s)
    this.heroSlideTimer = setInterval(() => {
      this.activeSlideIndex.update(idx => (idx + 1) % this.heroSlides.length);
    }, 5000);

    // 2. Start Testimonial Auto-Rotation
    this.startTestimonialTimer();
  }

  ngAfterViewInit(): void {
    // Start observing stats and scrolling reveals on browser side
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      // Hero entrance animation
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.querySelector('.hero-landing')?.classList.add('hero-loaded');
        }, 150);
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimatedStats) {
            this.animateStats();
            this.hasAnimatedStats = true;
          }
        });
      }, { threshold: 0.1 });

      const statsEl = this.statsSection();
      if (statsEl) {
        observer.observe(statsEl.nativeElement);
      }

      // Staggered reveals observer
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.heroSlideTimer) clearInterval(this.heroSlideTimer);
    if (this.testimonialTimer) clearInterval(this.testimonialTimer);
    if (this.progressTimer) clearInterval(this.progressTimer);
    if (this.pendingRafId !== null) cancelAnimationFrame(this.pendingRafId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScrollListener);
      document.removeEventListener('mousemove', this.onHeroMouseMove);
    }
  }

  toggleServices(): void {
    this.showAllServices.update((v) => !v);
  }

  // ─── Service Card: Crazy Hover Engine ───

  private findCard(target: EventTarget | null): HTMLElement | null {
    return (target as HTMLElement)?.closest?.('.service-card') as HTMLElement | null;
  }

  onServiceCardMouseMove(event: MouseEvent): void {
    if (this.isTouchDevice || this.prefersReducedMotion) return;

    const card = this.findCard(event.target);
    if (!card) return;

    // Capture values synchronously before rAF resets currentTarget
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.pendingMouseMove = { card, x, y };

    if (this.pendingRafId === null) {
      this.pendingRafId = requestAnimationFrame(() => {
        this.pendingRafId = null;
        const data = this.pendingMouseMove;
        if (!data) return;

        const { card: c, x: px, y: py } = data;
        const w = rect.width;
        const h = rect.height;
        const centerX = w / 2;
        const centerY = h / 2;

        // 3D tilt: ±8°
        const rotateX = -((py - centerY) / centerY) * 8;
        const rotateY = ((px - centerX) / centerX) * 8;

        // Parallax offsets
        const parallaxX = ((px - centerX) / centerX) * 8;
        const parallaxY = ((py - centerY) / centerY) * 6;

        // Apply card transform
        c.style.transform =
          `perspective(800px) translateY(-14px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Parallax on image
        const img = c.querySelector('.service-card__image') as HTMLElement | null;
        if (img) {
          img.style.transform = `scale(1.15) translate(${-parallaxX}px, ${-parallaxY}px)`;
        }

        // Parallax on body text
        const body = c.querySelector('.service-card__body') as HTMLElement | null;
        if (body) {
          body.style.transform = `translate(${parallaxX * 0.4}px, ${parallaxY * 0.3}px)`;
        }

        // Golden glow position
        c.style.setProperty('--glow-x', `${px}px`);
        c.style.setProperty('--glow-y', `${py}px`);
      });
    }
  }

  onServiceCardMouseEnter(event: Event): void {
    if (this.isTouchDevice || this.prefersReducedMotion) return;
    const card = this.findCard(event.target);
    if (!card) return;

    this.activeCardEl = card;
    card.classList.add('service-card--active');

    // Dim siblings
    const grid = card.closest('.services-grid');
    if (grid) {
      grid.querySelectorAll('.service-card').forEach((sibling) => {
        if (sibling !== card) {
          sibling.classList.add('service-card--dimmed');
        }
      });
    }
  }

  onServiceCardMouseLeave(event: Event): void {
    if (this.isTouchDevice || this.prefersReducedMotion) return;
    const card = this.findCard(event.target);
    if (!card) return;

    this.activeCardEl = null;
    card.classList.remove('service-card--active');

    // Reset sibling dimming
    const grid = card.closest('.services-grid');
    if (grid) {
      grid.querySelectorAll('.service-card').forEach((sibling) => {
        sibling.classList.remove('service-card--dimmed');
      });
    }

    // Reset inline styles
    card.style.transform = '';
    card.style.removeProperty('--glow-x');
    card.style.removeProperty('--glow-y');

    const img = card.querySelector('.service-card__image') as HTMLElement | null;
    if (img) img.style.transform = '';

    const body = card.querySelector('.service-card__body') as HTMLElement | null;
    if (body) body.style.transform = '';

    // Cancel pending rAF
    if (this.pendingRafId !== null) {
      cancelAnimationFrame(this.pendingRafId);
      this.pendingRafId = null;
    }
    this.pendingMouseMove = null;
  }

  // Scroll Listener — navbar glass + hero parallax
  private onScrollListener = (): void => {
    if (typeof window !== 'undefined') {
      const scrollY = window.scrollY;
      this.isScrolled.set(scrollY > 40);

      // Navbar glass effect
      const nav = document.querySelector('.hero-nav');
      if (nav) {
        nav.classList.toggle('hero-nav--scrolled', scrollY > 40);
      }

      // Hero parallax — bg image moves slower than scroll
      if (scrollY < window.innerHeight) {
        const heroBg = document.querySelector('.hero-bg') as HTMLElement | null;
        if (heroBg) {
          heroBg.style.transform = `translateY(${scrollY * 0.22}px)`;
        }
      }
    }
  };

  // Mouse micro-interactions — Morocco text + palm leaves react to cursor
  private onHeroMouseMove = (e: MouseEvent): void => {
    const morocco = document.querySelector('.hero-morocco-text span') as HTMLElement | null;
    const palmLeft = document.querySelector('.hero-atmo__palm--left') as HTMLElement | null;
    const palmRight = document.querySelector('.hero-atmo__palm--right') as HTMLElement | null;

    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    if (morocco) {
      morocco.style.transform = `translate(${x * 8}px, ${y * 4}px)`;
    }
    if (palmLeft) {
      palmLeft.style.transform = `rotate(${-2 + x * 3}deg)`;
    }
    if (palmRight) {
      palmRight.style.transform = `rotate(${2 + x * -3}deg)`;
    }
  };

  // (Parallax Handlers Removed)

  // Stats Count-Up Animation
  private animateStats(): void {
    const duration = 1500;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      // Easing curve (easeOutQuad)
      const ease = progress * (2 - progress);

      this.statsGuides.set(Math.floor(ease * 320));
      this.statsArtisans.set(Math.floor(ease * 180));
      this.statsCities.set(Math.floor(ease * 24));
      this.statsItineraries.set(Math.floor(ease * 12)); // Animate up to 12 (k)

      if (step >= steps) {
        this.statsGuides.set(320);
        this.statsArtisans.set(180);
        this.statsCities.set(24);
        this.statsItineraries.set(12);
        clearInterval(timer);
      }
    }, intervalTime);
  }

  // Blog category updates
  setBlogCategory(category: string): void {
    this.selectedBlogCategory.set(category);
    this.blogCurrentIndex.set(0);
  }

  nextBlog(): void {
    const max = this.filteredBlogs().length - 1;
    this.blogCurrentIndex.update(i => Math.min(i + 1, max));
  }

  prevBlog(): void {
    this.blogCurrentIndex.update(i => Math.max(i - 1, 0));
  }

  formatIndex(n: number): string {
    return n.toString().padStart(2, '0');
  }

  // Wishlist actions
  toggleWishlist(expId: string): void {
    this.wishlist.update(w => ({ ...w, [expId]: !w[expId] }));
  }

  // Testimonials Slider custom logic
  startTestimonialTimer(): void {
    if (this.testimonialTimer) clearInterval(this.testimonialTimer);
    if (this.progressTimer) clearInterval(this.progressTimer);

    this.testimonialTimer = setInterval(() => {
      if (!this.isTestimonialPaused) {
        this.nextTestimonial();
      }
    }, 4000);

    // Progress bar runner
    let progress = 0;
    this.testimonialProgress.set(0);
    this.progressTimer = setInterval(() => {
      if (!this.isTestimonialPaused) {
        progress += 2.5;
        this.testimonialProgress.set(progress);
        if (progress >= 100) {
          progress = 0;
        }
      }
    }, 100);
  }

  nextTestimonial(): void {
    this.currentTestimonialIndex.update(idx => (idx + 1) % this.testimonials.length);
    this.testimonialProgress.set(0);
    this.startTestimonialTimer();
  }

  prevTestimonial(): void {
    this.currentTestimonialIndex.update(idx => (idx - 1 + this.testimonials.length) % this.testimonials.length);
    this.testimonialProgress.set(0);
    this.startTestimonialTimer();
  }

  pauseTestimonials(): void {
    this.isTestimonialPaused = true;
  }

  resumeTestimonials(): void {
    this.isTestimonialPaused = false;
  }

  // Newsletter Sign up
  subscribeNewsletter(): void {
    const email = this.newsletterEmail().trim();
    if (email) {
      this.newsletterSuccess.set(true);
      this.newsletterEmail.set('');
      setTimeout(() => {
        this.newsletterSuccess.set(false);
      }, 5000);
    }
  }
}
