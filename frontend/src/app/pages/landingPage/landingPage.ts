import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed, OnInit, OnDestroy, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  imports: [FormsModule],
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
  blogs = [
    {
      category: 'Tourism',
      date: 'Jun 12, 2026',
      title: 'How AI is reshaping personalized travel in Morocco',
      description: 'Discover how itinerary engines and local data can create richer, safer journeys across cities and regions.',
      author: 'MarocSphere Editorial',
      image: '/images/Unique Marrakech Itinerary_ Hidden Gems & Highlights.jpg',
      link: '#'
    },
    {
      category: 'Moroccan Heritage',
      date: 'Jun 03, 2026',
      title: 'Why traceable artisan commerce matters for local communities',
      description: 'From QR proof to export badges, transparency builds trust for global buyers and Moroccan makers alike.',
      author: 'Leila Benkirane',
      image: '/images/Ceramica de Maroc.jpg',
      link: '#'
    },
    {
      category: 'Culture',
      date: 'May 27, 2026',
      title: 'The new generation of certified local guides',
      description: 'Explore how language skills, digital reservations, and verified credentials elevate the traveler experience.',
      author: 'Omar Tazi',
      image: '/images/Men walking through Moroccan desert.jpg',
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

  // References to DOM elements
  private statsSection = viewChild<ElementRef>('statsSection');

  ngOnInit(): void {
    // 1. Start Auto-Slideshow Timer (5s)
    this.heroSlideTimer = setInterval(() => {
      this.activeSlideIndex.update(idx => (idx + 1) % this.heroSlides.length);
    }, 5000);

    // 2. Start Testimonial Auto-Rotation
    this.startTestimonialTimer();

    // 3. Listen to scroll events on browser side
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScrollListener);
    }
  }

  ngAfterViewInit(): void {
    // Start observing stats and scrolling reveals on browser side
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
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
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScrollListener);
    }
  }

  toggleServices(): void {
    this.showAllServices.update((v) => !v);
  }

  // Scroll Listener
  private onScrollListener = (): void => {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 40);
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