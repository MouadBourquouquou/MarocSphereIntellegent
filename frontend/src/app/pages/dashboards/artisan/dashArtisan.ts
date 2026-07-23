import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  computed,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArtisanService } from '../../../services/artisan.service';
import { AvisService } from '../../../services/avis.service';
import { AuthService } from '../../../services/auth.service';
import { Artisan, Avis, Produit, ProduitCreationRequest, Commande, CommandeUpdateRequest } from '../../../models/api.models';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export type WorkspacePage = 'profile' | 'products' | 'orders' | 'analytics';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  orders: number;
  rating: number;
  views: number;
  favorites: number;
  image: string;
  status: 'published' | 'draft';
}

export interface Order {
  id: string;
  customerName: string;
  customerAvatar: string;
  customerCountry: string;
  products: string;
  quantity: number;
  date: string;
  totalPrice: string;
  shippingAddress: string;
  paymentStatus: 'paid' | 'pending';
  status: 'pending' | 'accepted' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  specialNote: string;
  deadline: string;
}

export interface ActivityItem {
  icon: string;
  text: string;
  time: string;
  color: 'terra' | 'green' | 'gold';
}

export interface Review {
  author: string;
  avatar: string;
  country: string;
  stars: number;
  text: string;
  product: string;
}

export interface Collection {
  id: string;
  title: string;
  story: string;
  image: string;
  productCount: number;
  accent: string;
}

export interface WorkshopStep {
  icon: string;
  label: string;
  active: boolean;
}

export interface GalleryImage {
  src: string;
  alt: string;
  span: 'wide' | 'tall' | 'normal';
}

export interface CustomerCountry {
  name: string;
  flag: string;
  orders: number;
  revenue: string;
}

export interface BestProduct {
  name: string;
  orders: number;
  revenue: string;
  trend: 'up' | 'down';
}

// ─── Component ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-dash-artisan',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './dashArtisan.html',
  styleUrls: ['./dashArtisan.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class dashboardArtisan implements AfterViewInit, OnDestroy {
  private artisanService = inject(ArtisanService);
  private avisService = inject(AvisService);
  private authService = inject(AuthService);

  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ordersChart') ordersChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;

  // ── Navigation ───────────────────────────────────────────────────────────
  activePage = signal<WorkspacePage>('profile');

  // ── Profile ─────────────────────────────────────────────────────────────
  artisan           = signal<Artisan | null>(null);
  artisanNom        = signal('');
  artisanPrenom     = signal('');
  artisanEmail      = signal('');
  artisanCraft      = signal('');
  artisanLocation   = signal('');
  artisanLanguages  = signal('');
  artisanBio        = signal('');
  isActive          = signal(true);
  isVerified        = signal(true);
  isLoading         = signal(true);
  isSaving          = signal(false);
  isEditing         = signal(false);

  // ── Notifications ─────────────────────────────────────────────────────────
  notificationMessage = signal('');
  notificationType    = signal<'success' | 'error'>('success');
  showNotification    = signal(false);

  // ── Activity ────────────────────────────────────────────────────────────
  todayActivity = signal<ActivityItem[]>([
    { icon: 'lucide:shopping-bag', text: 'New order received — 2x Zellige Tile Set', time: '12 min ago', color: 'green' },
    { icon: 'lucide:upload', text: 'Product published — Brass Lantern', time: '1h ago', color: 'terra' },
    { icon: 'lucide:message-circle', text: 'Sophie left a 5-star review', time: '2h ago', color: 'gold' },
    { icon: 'lucide:truck', text: 'Shipment delivered to Barcelona', time: '4h ago', color: 'green' },
    { icon: 'lucide:file-edit', text: 'Draft saved — Cedar Box (new variant)', time: '5h ago', color: 'gold' },
  ]);

  yesterdayActivity = signal<ActivityItem[]>([
    { icon: 'lucide:pencil', text: 'Product edited — Berber Rug pricing updated', time: 'Yesterday', color: 'gold' },
    { icon: 'lucide:package-check', text: 'Inventory restocked — Leather Journals', time: 'Yesterday', color: 'green' },
    { icon: 'lucide:trending-up', text: 'Revenue milestone reached — 42K MAD', time: 'Yesterday', color: 'terra' },
  ]);

  // ── Collections ──────────────────────────────────────────────────────────
  collections = signal<Collection[]>([
    {
      id: 'col-1', title: 'Traditional Ceramics of Fez',
      story: 'Hand-painted zellige tiles and pottery crafted in the ancient kilns of Fez, where masters have perfected their art over seven centuries.',
      image: '/images/Unique Marrakech Itinerary_ Hidden Gems & Highlights.jpg',
      productCount: 8, accent: 'terra',
    },
    {
      id: 'col-2', title: 'Atlas Mountain Woodwork',
      story: 'Cedar and thuya wood boxes, carved with Amazigh symbols by artisans in the High Atlas villages.',
      image: '/images/Marrakech Morocco.jpg',
      productCount: 5, accent: 'gold',
    },
    {
      id: 'col-3', title: 'Leather & Paper',
      story: 'Hand-tooled journals and leather goods from the tanneries of Fez, made with vegetable-tanned leather and centuries-old techniques.',
      image: '/images/Men walking through Moroccan desert.jpg',
      productCount: 12, accent: 'green',
    },
  ]);

  // ── Workshop Journey ────────────────────────────────────────────────────
  journeySteps = signal<WorkshopStep[]>([
    { icon: 'lucide:palette', label: 'Clay Selected', active: false },
    { icon: 'lucide:hand', label: 'Hand Crafted', active: false },
    { icon: 'lucide:paintbrush', label: 'Painted', active: false },
    { icon: 'flame', label: 'Kiln Fired', active: true },
    { icon: 'lucide:search-check', label: 'Quality Checked', active: false },
    { icon: 'lucide:package-check', label: 'Ready for Shipping', active: false },
  ]);

  // ── Reviews ──────────────────────────────────────────────────────────────
  reviews = signal<Review[]>([]);

  // ── Gallery ──────────────────────────────────────────────────────────────
  galleryImages = signal<GalleryImage[]>([
    { src: '/images/Unique Marrakech Itinerary_ Hidden Gems & Highlights.jpg', alt: 'Workshop overview', span: 'wide' },
    { src: '/images/Marrakech Morocco.jpg', alt: 'Hand painting zellige', span: 'tall' },
    { src: '/images/Men walking through Moroccan desert.jpg', alt: 'Raw materials', span: 'normal' },
    { src: '/images/marrakech1.png', alt: 'Finished pieces', span: 'normal' },
    { src: '/images/marrakech2.png', alt: 'Kiln room', span: 'wide' },
  ]);

  // ── Customer Countries ──────────────────────────────────────────────────
  customerCountries = signal<CustomerCountry[]>([
    { name: 'France', flag: '🇫🇷', orders: 34, revenue: '18.2K' },
    { name: 'Spain', flag: '🇪🇸', orders: 22, revenue: '11.4K' },
    { name: 'Germany', flag: '🇩🇪', orders: 15, revenue: '8.1K' },
    { name: 'USA', flag: '🇺🇸', orders: 11, revenue: '6.8K' },
    { name: 'Japan', flag: '🇯🇵', orders: 7, revenue: '4.2K' },
  ]);

  // ── Products ──────────────────────────────────────────────────────────────
  productFilter = signal<'all' | 'published' | 'draft' | 'outofstock'>('all');
  productSearch = signal<string>('');
  orderFilter = signal<'all' | 'pending' | 'accepted' | 'preparing' | 'shipped' | 'completed'>('all');
  showDropdownId = signal<string | null>(null);

  // Product form
  showProductModal    = signal(false);
  editingProductId    = signal<string | null>(null);
  productFormName     = signal('');
  productFormDesc     = signal('');
  productFormCategory = signal('');
  productFormPrice    = signal(0);
  productFormStock    = signal(0);
  productFormImage    = signal('');

  products = signal<Product[]>([]);

  filteredProducts = computed(() => {
    let list = this.products();
    const filter = this.productFilter();
    const search = this.productSearch().toLowerCase();
    if (filter === 'published') list = list.filter(p => p.status === 'published');
    if (filter === 'draft')     list = list.filter(p => p.status === 'draft');
    if (filter === 'outofstock') list = list.filter(p => p.stock === 0);
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search)
    );
    return list;
  });

  featuredProduct = computed(() =>
    [...this.products()].sort((a, b) => b.orders - a.orders)[0]
  );

  draftProducts = computed(() => this.products().filter(p => p.status === 'draft'));
  outOfStockProducts = computed(() => this.products().filter(p => p.stock === 0));
  bestSellers = computed(() =>
    [...this.products()].sort((a, b) => b.orders - a.orders).slice(0, 5)
  );
  leastPerforming = computed(() =>
    [...this.products()].sort((a, b) => a.views - b.views).slice(0, 3)
  );

  // ── Orders ──────────────────────────────────────────────────────────────
  orders = signal<Order[]>([]);

  ordersNeedingAttention = computed(() =>
    this.orders().filter(o => o.status === 'pending')
  );
  ordersInProduction = computed(() =>
    this.orders().filter(o => o.status === 'accepted' || o.status === 'preparing')
  );
  ordersReadyToShip = computed(() =>
    this.orders().filter(o => o.status === 'shipped')
  );
  ordersCompleted = computed(() =>
    this.orders().filter(o => o.status === 'delivered' || o.status === 'cancelled')
  );

  // ── Analytics ──────────────────────────────────────────────────────────
  monthlyRevenue = computed(() => {
    const total = this.orders().reduce((sum, o) => {
      const num = parseFloat(o.totalPrice.replace(/[^\d.]/g, '')) || 0;
      return sum + num;
    }, 0);
    return total.toLocaleString('en-US', { maximumFractionDigits: 0 });
  });
  totalRevenue = computed(() => {
    const total = this.orders().reduce((sum, o) => {
      const num = parseFloat(o.totalPrice.replace(/[^\d.]/g, '')) || 0;
      return sum + num;
    }, 0);
    return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total.toString();
  });
  totalProducts = computed(() => this.products().length);
  totalReviews = computed(() => this.reviews().length);
  averageRating = computed(() => {
    const revs = this.reviews();
    if (revs.length === 0) return 0;
    return revs.reduce((sum, r) => sum + r.stars, 0) / revs.length;
  });
  returningCustomers = signal(38);
  avgProductionDays = signal(4.2);

  bestSellingProducts = computed<BestProduct[]>(() =>
    [...this.products()]
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        orders: p.orders,
        revenue: `${((p.price * p.orders) / 1000).toFixed(1)}K`,
        trend: 'up' as const,
      }))
  );

  // ── Internal ──────────────────────────────────────────────────────────────
  private isBrowser: boolean;
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private cleanupFns: Array<() => void> = [];
  private revenueChartInstance: any = null;
  private ordersChartInstance: any = null;
  private categoryChartInstance: any = null;

  constructor(
    private elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngAfterViewInit(): void {
    this.loadArtisan();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach(fn => fn());
    if (this.toastTimeoutId !== null) clearTimeout(this.toastTimeoutId);
    this.destroyCharts();
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  navigate(page: WorkspacePage): void {
    this.activePage.set(page);
    if (page === 'products') this.loadProducts();
    if (page === 'orders') this.loadOrders();
    if (page === 'analytics') {
      this.loadProducts();
      this.loadOrders();
      if (this.isBrowser) {
        setTimeout(() => this.initCharts(), 250);
      }
    }
  }

  // ── Profile ───────────────────────────────────────────────────────────────
  private loadArtisan(): void {
    this.artisanService.getMe().subscribe({
      next: a => {
        this.artisan.set(a);
        this.artisanNom.set(a.nom ?? '');
        this.artisanPrenom.set(a.prenom ?? '');
        this.artisanEmail.set(a.email ?? '');
        this.artisanCraft.set(a.categorieArtisanat ?? '');
        this.artisanLocation.set(a.nationalite ?? '');
        this.artisanLanguages.set(a.languePreferee ?? '');
        this.isLoading.set(false);
        this.loadProducts();
        this.loadOrders();
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
      const a = this.artisan();
      if (a) {
        this.artisanNom.set(a.nom ?? '');
        this.artisanPrenom.set(a.prenom ?? '');
        this.artisanCraft.set(a.categorieArtisanat ?? '');
        this.artisanLocation.set(a.nationalite ?? '');
        this.artisanLanguages.set(a.languePreferee ?? '');
      }
    }
  }

  saveProfile(event: Event): void {
    event.preventDefault();
    const a = this.artisan();
    if (!a) return;
    this.isSaving.set(true);
    this.artisanService.updateProfile(a.id!, {
      nom: this.artisanNom(), prenom: this.artisanPrenom(),
      nationalite: this.artisanLocation(), languePreferee: this.artisanLanguages(),
      categorieArtisanat: this.artisanCraft(),
    }).subscribe({
      next: updated => {
        this.artisan.set(updated);
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.notify('Profile updated.', 'success');
      },
      error: () => { this.isSaving.set(false); this.notify('Update failed.', 'error'); },
    });
  }

  toggleAvailability(): void {
    this.isActive.update(v => !v);
    this.notify(this.isActive() ? 'You are now accepting orders.' : 'You are now unavailable.', 'success');
  }

  logout(): void { this.authService.logout(); }

  // ── Products ─────────────────────────────────────────────────────────────
  private loadProducts(): void {
    const a = this.artisan();
    if (!a) return;
    this.artisanService.getProduitsByArtisan(a.id!).subscribe({
      next: list => this.products.set(list.map(p => this.mapProduit(p))),
      error: () => this.notify('Failed to load products.', 'error'),
    });
  }

  private mapProduit(p: Produit): Product {
    return {
      id: p.id.toString(),
      name: p.nom ?? '',
      description: p.description ?? '',
      category: p.categorie ?? '',
      price: p.prix ?? 0,
      stock: p.stock ?? 0,
      orders: p.nbCommandes ?? 0,
      rating: p.note ?? 0,
      views: 0,
      favorites: 0,
      image: p.imageUrl || '/images/marrakech1.png',
      status: 'published',
    };
  }

  openProductModal(): void {
    this.editingProductId.set(null);
    this.productFormName.set('');
    this.productFormDesc.set('');
    this.productFormCategory.set('');
    this.productFormPrice.set(0);
    this.productFormStock.set(0);
    this.productFormImage.set('');
    this.showProductModal.set(true);
  }

  closeProductModal(): void {
    this.showProductModal.set(false);
    this.editingProductId.set(null);
  }

  saveProduct(event: Event): void {
    event.preventDefault();
    const a = this.artisan();
    if (!a) return;

    const payload: ProduitCreationRequest = {
      nom: this.productFormName(),
      description: this.productFormDesc(),
      categorie: this.productFormCategory(),
      prix: this.productFormPrice(),
      stock: this.productFormStock(),
      disponibilite: this.productFormStock() > 0 ? 'In Stock' : 'Out of Stock',
      note: 0,
      imageUrl: this.productFormImage() || '/images/marrakech1.png',
      materiels: '',
      processFabrication: '',
    };

    const id = this.editingProductId();
    if (id) {
      this.artisanService.updateProduit(parseInt(id, 10), payload).subscribe({
        next: updated => {
          this.products.update(list => list.map(p => p.id === id ? this.mapProduit(updated) : p));
          this.notify('Product updated.', 'success');
          this.closeProductModal();
        },
        error: () => this.notify('Failed to update product.', 'error'),
      });
    } else {
      this.artisanService.createProduit(a.id!, payload).subscribe({
        next: created => {
          this.products.update(list => [this.mapProduit(created), ...list]);
          this.notify('Product created.', 'success');
          this.closeProductModal();
        },
        error: () => this.notify('Failed to create product.', 'error'),
      });
    }
  }

  toggleProductStatus(id: string): void {
    this.products.update(list => list.map(p =>
      p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p
    ));
  }

  deleteProduct(id: string): void {
    this.artisanService.deleteProduit(parseInt(id, 10)).subscribe({
      next: () => {
        this.products.update(list => list.filter(p => p.id !== id));
        this.showDropdownId.set(null);
        this.notify('Product deleted.', 'success');
      },
      error: () => this.notify('Failed to delete product.', 'error'),
    });
  }

  duplicateProduct(id: string): void {
    const src = this.products().find(p => p.id === id);
    if (!src) return;
    const a = this.artisan();
    if (!a) return;

    const payload: ProduitCreationRequest = {
      nom: `${src.name} (Copy)`,
      description: src.description,
      categorie: src.category,
      prix: src.price,
      stock: src.stock,
      disponibilite: src.stock > 0 ? 'In Stock' : 'Out of Stock',
      note: 0,
      imageUrl: src.image,
      materiels: '',
      processFabrication: '',
    };

    this.artisanService.createProduit(a.id!, payload).subscribe({
      next: created => {
        this.products.update(list => [this.mapProduit(created), ...list]);
        this.showDropdownId.set(null);
        this.notify('Product duplicated.', 'success');
      },
      error: () => this.notify('Failed to duplicate product.', 'error'),
    });
  }

  toggleDropdown(id: string): void {
    this.showDropdownId.update(v => v === id ? null : id);
  }

  // ── Orders ──────────────────────────────────────────────────────────────
  private loadOrders(): void {
    const a = this.artisan();
    if (!a) return;
    this.artisanService.getCommandesByArtisan(a.id!).subscribe({
      next: list => this.orders.set(list.map(o => this.mapCommande(o))),
      error: () => this.notify('Failed to load orders.', 'error'),
    });
  }

  private mapCommande(c: Commande): Order {
    const firstName = c.clientPrenom ?? '';
    const lastName = c.clientNom ?? '';
    const fullName = `${firstName} ${lastName}`.trim() || `Client #${c.clientId}`;
    const totalQty = c.items?.reduce((sum, i) => sum + (i.quantite ?? 0), 0) ?? 0;
    const productNames = c.items?.map(i => i.produitNom ?? '').filter(Boolean).join(', ') || 'N/A';

    return {
      id: c.id.toString(),
      customerName: fullName,
      customerAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=B03A22&color=fff&size=128`,
      customerCountry: 'Morocco',
      products: productNames,
      quantity: totalQty,
      date: c.dateCommande ? new Date(c.dateCommande).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
      totalPrice: c.montantTotal ? `${c.montantTotal.toLocaleString()} MAD` : 'TBD',
      shippingAddress: c.adresseLivraison ?? '',
      paymentStatus: c.statutPaiement?.toLowerCase() === 'paid' ? 'paid' : 'pending',
      status: this.mapCommandeStatus(c.statut),
      specialNote: c.notes ?? '',
      deadline: '',
    };
  }

  private mapCommandeStatus(statut: string): Order['status'] {
    switch (statut?.toUpperCase()) {
      case 'CONFIRMED': return 'accepted';
      case 'ACCEPTED': return 'accepted';
      case 'PREPARING': return 'preparing';
      case 'SHIPPED': return 'shipped';
      case 'DELIVERED': return 'delivered';
      case 'CANCELLED': return 'cancelled';
      default: return 'pending';
    }
  }

  private mapStatusToBackend(status: Order['status']): string {
    switch (status) {
      case 'accepted': return 'CONFIRMED';
      case 'preparing': return 'PREPARING';
      case 'shipped': return 'SHIPPED';
      case 'delivered': return 'DELIVERED';
      case 'cancelled': return 'CANCELLED';
      default: return 'PENDING';
    }
  }

  // ── Reviews ──────────────────────────────────────────────────────────────
  private loadReviews(): void {
    const a = this.artisan();
    if (!a) return;
    this.avisService.getByArtisanId(a.id!).subscribe({
      next: list => this.reviews.set(list.map(r => this.mapAvis(r))),
      error: () => {},
    });
  }

  private mapAvis(a: Avis): Review {
    const text = a.commentaire ?? '';
    const starCount = a.note ?? 5;
    return {
      author: `Client #${a.auteurId}`,
      avatar: `https://ui-avatars.com/api/?name=C${a.auteurId}&background=B03A22&color=fff&size=128`,
      country: 'Morocco',
      stars: starCount,
      text: text,
      product: '',
    };
  }

  private updateOrderStatus(id: string, status: Order['status']): void {
    const numId = parseInt(id, 10);
    this.artisanService.updateCommandeStatut(numId, { statut: this.mapStatusToBackend(status) }).subscribe({
      next: updated => {
        this.orders.update(list => list.map(o => o.id === id ? this.mapCommande(updated) : o));
      },
      error: () => this.notify('Failed to update order.', 'error'),
    });
  }

  acceptOrder(id: string): void {
    this.updateOrderStatus(id, 'accepted');
    this.notify('Order accepted.', 'success');
  }

  rejectOrder(id: string): void {
    this.updateOrderStatus(id, 'cancelled');
    this.notify('Order rejected.', 'success');
  }

  prepareOrder(id: string): void {
    this.updateOrderStatus(id, 'preparing');
    this.notify('Order marked as preparing.', 'success');
  }

  shipOrder(id: string): void {
    this.updateOrderStatus(id, 'shipped');
    this.notify('Order shipped.', 'success');
  }

  deliverOrder(id: string): void {
    this.updateOrderStatus(id, 'delivered');
    this.notify('Order delivered.', 'success');
  }

  // ── Analytics ──────────────────────────────────────────────────────────
  private initCharts(): void {
    if (!this.isBrowser) return;
    this.destroyCharts();

    const loadChart = async () => {
      try {
        const Chart = (await import('chart.js/auto')).default;
        const gridColor = '#E8E0D4';
        const tickColor = '#7A6E65';
        const fontOpts = { family: 'Manrope' };

        const orders = this.orders();
        const products = this.products();

        // Revenue by month
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyRevenue = new Array(12).fill(0);
        orders.forEach(o => {
          const num = parseInt(o.totalPrice.replace(/[^0-9]/g, ''), 10) || 0;
          const d = new Date(o.date);
          if (!isNaN(d.getTime())) {
            monthlyRevenue[d.getMonth()] += num;
          }
        });
        const activeMonths = monthlyRevenue.some(v => v > 0)
          ? monthNames.filter((_, i) => monthlyRevenue[i] > 0)
          : monthNames;
        const activeData = monthlyRevenue.some(v => v > 0)
          ? monthlyRevenue.filter(v => v > 0)
          : monthlyRevenue;

        if (this.revenueChartRef?.nativeElement) {
          this.revenueChartInstance = new Chart(this.revenueChartRef.nativeElement, {
            type: 'bar',
            data: {
              labels: activeMonths,
              datasets: [{
                label: 'Revenue (MAD)',
                data: activeData,
                backgroundColor: 'rgba(176, 58, 34, 0.15)',
                borderColor: '#B03A22', borderWidth: 2, borderRadius: 8, borderSkipped: false,
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: tickColor, font: fontOpts } },
                x: { grid: { display: false }, ticks: { color: tickColor, font: fontOpts } },
              },
            },
          });
        }

        // Orders by status
        const statusCounts: Record<string, number> = {};
        orders.forEach(o => {
          statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
        });
        const statusLabels = Object.keys(statusCounts).length > 0
          ? Object.keys(statusCounts)
          : ['No Data'];
        const statusData = Object.keys(statusCounts).length > 0
          ? Object.values(statusCounts)
          : [1];

        if (this.ordersChartRef?.nativeElement) {
          this.ordersChartInstance = new Chart(this.ordersChartRef.nativeElement, {
            type: 'line',
            data: {
              labels: statusLabels,
              datasets: [{
                label: 'Orders',
                data: statusData,
                borderColor: '#005C2E', backgroundColor: 'rgba(0, 92, 46, 0.08)',
                fill: true, tension: 0.4,
                pointBackgroundColor: '#005C2E', pointBorderColor: '#fff',
                pointBorderWidth: 2, pointRadius: 4,
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: tickColor, font: fontOpts } },
                x: { grid: { display: false }, ticks: { color: tickColor, font: fontOpts } },
              },
            },
          });
        }

        // Revenue by category
        const catRevenue: Record<string, number> = {};
        products.forEach(p => {
          const cat = p.category || 'Other';
          catRevenue[cat] = (catRevenue[cat] || 0) + p.price * p.orders;
        });
        const catLabels = Object.keys(catRevenue).length > 0 ? Object.keys(catRevenue) : ['No Products'];
        const catData = Object.keys(catRevenue).length > 0 ? Object.values(catRevenue) : [1];
        const catColors = ['#B03A22', '#B8882C', '#005C2E', '#1661A1', '#7C3ACF', '#C46D2B', '#4A6741'];

        if (this.categoryChartRef?.nativeElement) {
          this.categoryChartInstance = new Chart(this.categoryChartRef.nativeElement, {
            type: 'doughnut',
            data: {
              labels: catLabels,
              datasets: [{
                data: catData,
                backgroundColor: catColors.slice(0, catLabels.length),
                borderWidth: 0,
                spacing: 3, borderRadius: 6,
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              cutout: '65%',
              plugins: {
                legend: { position: 'bottom', labels: { color: tickColor, font: fontOpts, padding: 16, usePointStyle: true, pointStyleWidth: 10 } },
              },
            },
          });
        }
      } catch (e) {
        console.warn('Chart.js not available', e);
      }
    };

    loadChart();
  }

  private destroyCharts(): void {
    this.revenueChartInstance?.destroy();
    this.ordersChartInstance?.destroy();
    this.categoryChartInstance?.destroy();
    this.revenueChartInstance = null;
    this.ordersChartInstance = null;
    this.categoryChartInstance = null;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  artisanInitials = computed(() =>
    `${this.artisanPrenom().charAt(0)}${this.artisanNom().charAt(0)}`.toUpperCase() || 'MA'
  );

  pendingOrderCount = computed(() => this.orders().filter(o => o.status === 'pending').length);
  completedOrderCount = computed(() => this.orders().filter(o => o.status === 'delivered').length);

  notify(message: string, type: 'success' | 'error'): void {
    this.notificationMessage.set(message);
    this.notificationType.set(type);
    this.showNotification.set(true);
    if (this.toastTimeoutId !== null) clearTimeout(this.toastTimeoutId);
    this.toastTimeoutId = setTimeout(() => this.showNotification.set(false), 4000);
  }
}
