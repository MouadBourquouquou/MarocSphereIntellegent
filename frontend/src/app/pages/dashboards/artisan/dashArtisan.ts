import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  computed,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ArtisanService } from '../../../services/artisan.service';
import { AuthService } from '../../../services/auth.service';
import { Artisan, Produit, Commande } from '../../../models/api.models';
import { avatarUrl } from '../../../utils/display.utils';

interface ArtisanProfile {
  id: number;
  name: string;
  role: string;
  workshop: string;
  category: string;
  biography: string;
  contact: string;
  phone: string;
  location: string;
  independant?: boolean;
  nationalite?: string;
  languePreferee?: string;
  qrTraceId?: string;
  eligibleExport?: boolean;
  dateCreation?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  rating: number;
  orders: number;
  image: string;
  materials: string;
  process: string;
}

interface ProductForm {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  rating: string;
  orders: string;
  image: string;
  materials: string;
  process: string;
}

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: number;
  customer: string;
  contact: string;
  products: OrderItem[];
  total: number;
  date: string;
  paymentStatus: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Rejected';
  address: string;
  paymentMethod: string;
  notes: string;
  timeline: string[];
}

@Component({
  selector: 'app-artisan-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashArtisan.html',
  styleUrls: ['./dashArtisan.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class dashboardArtisan implements OnInit, AfterViewInit, OnDestroy {
  private artisanService = inject(ArtisanService);
  private authService = inject(AuthService);

  showAllServices = signal(false);
  profileEdit = signal(false);
  profile = signal<ArtisanProfile>({
    id: 0,
    name: '',
    role: '',
    workshop: '',
    category: '',
    biography: '',
    contact: '',
    phone: '',
    location: '',
    independant: true,
    nationalite: '',
    languePreferee: '',
    qrTraceId: '',
    eligibleExport: false,
  });

  profileForm!: ArtisanProfile;
  productForm!: ProductForm;
  avatar = computed(() => avatarUrl(this.displayName()));

  isLoading = signal(true);
  errorMessage = signal('');
  displayName = computed(() => this.profile().name || 'Artisan');
  memberSince = computed(() => {
    const d = this.profile().dateCreation;
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });
  logout = (): void => this.authService.logout();

  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');
  showToast = signal(false);
  toastTimeout: ReturnType<typeof setTimeout> | null = null;

  productModalOpen = signal(false);
  productModalMode = signal<'add' | 'edit' | 'view'>('add');
  editingProductId = signal<number | null>(null);
  productToDeleteId = signal<number | null>(null);
  confirmDeleteModal = signal(false);

  productSearch = signal('');
  productSort = signal<'newest' | 'price-asc' | 'price-desc'>('newest');
  productFilter = signal<'all' | 'available' | 'low-stock' | 'out-of-stock'>('all');
  currentPage = signal(1);
  readonly pageSize = 4;
  selectedProduct = signal<Product | null>(null);

  orderDetailOpen = signal(false);
  selectedOrder = signal<Order | null>(null);
  orderSearch = signal('');
  orderFilter = signal<'all' | 'pending' | 'confirmed' | 'rejected' | 'completed'>('all');

  products = signal<Product[]>([]);
  orders = signal<Order[]>([]);

  filteredProducts = computed(() => {
    const query = this.productSearch().trim().toLowerCase();
    const filter = this.productFilter();
    const sort = this.productSort();

    const filtered = this.products().filter((product) => {
      const textMatch =
        !query ||
        [product.name, product.category, product.description].some((value) =>
          value.toLowerCase().includes(query),
        );

      const filterMatch =
        filter === 'all' ||
        (filter === 'available' && product.availability === 'In Stock') ||
        (filter === 'low-stock' && product.stock > 0 && product.stock <= 5) ||
        (filter === 'out-of-stock' && product.stock === 0);

      return textMatch && filterMatch;
    });

    return filtered.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return b.orders - a.orders;
    });
  });

  productPageCount = computed(() => Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize)));

  currentProductPage = computed(() => Math.min(this.currentPage(), this.productPageCount()));

  paginatedProducts = computed(() => {
    const page = this.currentProductPage();
    const start = (page - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  filteredOrders = computed(() => {
    const query = this.orderSearch().trim().toLowerCase();
    const filter = this.orderFilter();

    return this.orders().filter((order) => {
      const queryMatch =
        !query ||
        [order.id.toString(), order.customer, order.contact, order.paymentMethod, order.address]
          .join(' ')
          .toLowerCase()
          .includes(query);
      const filterMatch = filter === 'all' || order.status.toLowerCase() === filter;
      return queryMatch && filterMatch;
    });
  });

  totalProducts = computed(() => this.products().length);
  pendingOrders = computed(() => this.orders().filter((o) => o.status === 'Pending').length);
  confirmedOrders = computed(() => this.orders().filter((o) => o.status === 'Confirmed').length);
  completedOrders = computed(() => this.orders().filter((o) => o.status === 'Completed').length);
  revenue = computed(() => this.orders().reduce((sum, o) => sum + o.total, 0));
  averageRating = computed(() => {
    const p = this.products();
    if (!p.length) return '0.0';
    return (p.reduce((sum, item) => sum + item.rating, 0) / p.length).toFixed(1);
  });
  customerCount = computed(() => new Set(this.orders().map((o) => o.customer)).size);

  private isBrowser: boolean;
  private cleanupFns: Array<() => void> = [];
  private chart: Chart | null = null;
  private chartTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.profileForm = { ...this.profile() };
    this.productForm = {
      id: '', name: '', description: '', category: '', price: '', stock: '1',
      availability: 'In Stock', rating: '4.9', orders: '0', image: '', materials: '', process: '',
    };
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.setupSmoothScroll();
    this.setupFormPreventDefault();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    if (this.chartTimeoutId !== null) clearTimeout(this.chartTimeoutId);
    if (this.toastTimeout !== null) clearTimeout(this.toastTimeout);
    this.chart?.destroy();
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.artisanService.getMe().subscribe({
      next: (artisan) => {
        const p: ArtisanProfile = {
          id: artisan.id,
          name: `${artisan.prenom} ${artisan.nom}`,
          role: artisan.categorieArtisanat || 'Artisan',
          workshop: `${artisan.prenom}'s Workshop`,
          category: artisan.categorieArtisanat || 'Artisanat',
          biography: '',
          contact: artisan.email,
          phone: artisan.telephone || '',
          location: artisan.nationalite || '',
          independant: artisan.independant,
          nationalite: artisan.nationalite,
          languePreferee: artisan.languePreferee,
          qrTraceId: artisan.qrTraceId,
          eligibleExport: artisan.eligibleExport,
          dateCreation: artisan.dateCreation,
        } as ArtisanProfile;
        this.profile.set(p);
        this.profileForm = { ...p };
        this.isLoading.set(false);
        this.loadProducts(artisan.id);
        this.loadOrders(artisan.id);
        this.initArtisanSalesChart();
      },
      error: (err) => {
        this.errorMessage.set('Impossible de charger votre profil artisan.');
        this.isLoading.set(false);
        console.error('Failed to load artisan profile', err);
      },
    });
  }

  private loadProducts(artisanId: number): void {
    this.artisanService.getProduitsByArtisan(artisanId).subscribe({
      next: (produits) => {
        const mapped: Product[] = produits.map((p) => ({
          id: p.id,
          name: p.nom,
          description: p.description || '',
          category: p.categorie || '',
          price: p.prix,
          stock: p.stock,
          availability: p.disponibilite as 'In Stock' | 'Low Stock' | 'Out of Stock',
          rating: p.note,
          orders: p.nbCommandes,
          image: p.imageUrl || 'https://uxmagic.blob.core.windows.net/public/project-documents/placeholder-artisan.png',
          materials: p.materiels || '',
          process: p.processFabrication || '',
        }));
        this.products.set(mapped);
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }

  private loadOrders(artisanId: number): void {
    this.artisanService.getCommandesByArtisan(artisanId).subscribe({
      next: (commandes) => {
        const mapped: Order[] = commandes.map((c) => ({
          id: c.id,
          customer: `${c.clientPrenom} ${c.clientNom}`,
          contact: c.clientEmail,
          products: c.items.map((i) => ({ name: i.produitNom, qty: i.quantite, price: i.prixUnitaire })),
          total: c.montantTotal,
          date: c.dateCommande ? new Date(c.dateCommande).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
          paymentStatus: c.statutPaiement || '',
          status: c.statut as 'Pending' | 'Confirmed' | 'Completed' | 'Rejected',
          address: c.adresseLivraison || '',
          paymentMethod: c.methodePaiement || '',
          notes: c.notes || '',
          timeline: [c.statut === 'Pending' ? 'Order placed' : c.statut],
        }));
        this.orders.set(mapped);
      },
      error: (err) => console.error('Failed to load orders', err),
    });
  }

  private initArtisanSalesChart(): void {
    this.chartTimeoutId = setTimeout(() => {
      const canvas = this.elRef.nativeElement.querySelector<HTMLCanvasElement>('#artisanSalesChart');
      if (!canvas) return;
      Chart.register(...registerables);
      this.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [{
            label: 'Revenue (MAD)',
            data: [32000, 45000, 41000, 58000, 62000, 68400],
            borderColor: '#006233',
            backgroundColor: 'rgba(0, 98, 51, 0.05)',
            borderWidth: 3, fill: true, tension: 0.4,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(234, 223, 201, 0.2)' } },
            x: { grid: { display: false } },
          },
        },
      });
    }, 100);
  }

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

  switchDashboardTab(tabId: string): void {
    if (!this.isBrowser) return;
    const root = this.elRef.nativeElement;
    root.querySelectorAll<HTMLElement>('.dash-tab-btn').forEach((btn) => {
      btn.classList.remove('bg-secondary', 'text-secondary-foreground', 'shadow-sm');
      btn.classList.add('text-muted-foreground', 'hover:text-foreground');
    });
    const activeBtn = root.querySelector<HTMLElement>(`#${tabId}-tab`);
    activeBtn?.classList.remove('text-muted-foreground', 'hover:text-foreground');
    activeBtn?.classList.add('bg-secondary', 'text-secondary-foreground', 'shadow-sm');
    root.querySelectorAll<HTMLElement>('.dash-tab-pane').forEach((pane) => pane.classList.add('hidden'));
    root.querySelector<HTMLElement>(`#${tabId}-content`)?.classList.remove('hidden');
  }

  enableProfileEdit(): void {
    this.profileForm = { ...this.profile() };
    this.profileEdit.set(true);
  }

  saveProfile(): void {
    const artisanId = this.profile().id;
    this.artisanService.updateProfile(artisanId, {
      nom: this.profileForm.name.split(' ').slice(-1)[0] || this.profileForm.name,
      prenom: this.profileForm.name.split(' ').slice(0, -1).join(' ') || '',
      telephone: this.profileForm.phone,
      categorieArtisanat: this.profileForm.category,
    } as Partial<Artisan>).subscribe({
      next: (updated) => {
        const p = { ...this.profile() };
        p.name = `${updated.prenom} ${updated.nom}`;
        p.category = updated.categorieArtisanat || p.category;
        p.phone = updated.telephone || p.phone;
        this.profile.set(p);
        this.profileForm = { ...p };
        this.profileEdit.set(false);
        this.showToastNotification('Votre profil a été mis à jour avec succès.', 'success');
      },
      error: () => this.showToastNotification('Erreur lors de la mise à jour du profil.', 'error'),
    });
  }

  cancelProfileEdit(): void {
    this.profileForm = { ...this.profile() };
    this.profileEdit.set(false);
  }

  private showToastNotification(message: string, type: 'success' | 'error'): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);
    this.toastTimeout = setTimeout(() => this.showToast.set(false), 3200);
  }

  openProductModal(mode: 'add' | 'edit' | 'view', product?: Product): void {
    this.productModalMode.set(mode);
    this.editingProductId.set(product?.id ?? null);
    this.selectedProduct.set(mode === 'view' ? (product ?? null) : null);

    if (product) {
      this.productForm = {
        id: product.id.toString(), name: product.name, description: product.description,
        category: product.category, price: product.price.toString(), stock: product.stock.toString(),
        availability: product.availability, rating: product.rating.toString(), orders: product.orders.toString(),
        image: product.image, materials: product.materials, process: product.process,
      };
    } else {
      this.productForm = {
        id: '', name: '', description: '', category: '', price: '', stock: '1',
        availability: 'In Stock', rating: '4.9', orders: '0', image: '', materials: '', process: '',
      };
    }
    this.productModalOpen.set(true);
  }

  closeProductModal(): void {
    this.productModalOpen.set(false);
    this.editingProductId.set(null);
    this.selectedProduct.set(null);
  }

  saveProduct(): void {
    if (!this.productForm.name.trim() || !this.productForm.category.trim()) {
      this.showToastNotification('Veuillez entrer un nom et une catégorie de produit.', 'error');
      return;
    }

    const data = {
      nom: this.productForm.name.trim(),
      description: this.productForm.description.trim(),
      categorie: this.productForm.category.trim(),
      prix: Number(this.productForm.price) || 0,
      stock: Number(this.productForm.stock) || 0,
      disponibilite: this.productForm.availability,
      note: Number(this.productForm.rating) || 0,
      imageUrl: this.productForm.image || 'https://uxmagic.blob.core.windows.net/public/project-documents/placeholder-artisan.png',
      materiels: this.productForm.materials.trim(),
      processFabrication: this.productForm.process.trim(),
    };

    if (this.productModalMode() === 'edit' && this.editingProductId()) {
      this.artisanService.updateProduit(this.editingProductId()!, data).subscribe({
        next: () => {
          this.loadProducts(this.profile().id);
          this.showToastNotification('Produit mis à jour avec succès.', 'success');
        },
        error: () => this.showToastNotification('Erreur lors de la mise à jour du produit.', 'error'),
      });
    } else {
      this.artisanService.createProduit(this.profile().id, data).subscribe({
        next: () => {
          this.loadProducts(this.profile().id);
          this.showToastNotification('Produit ajouté à votre catalogue.', 'success');
        },
        error: () => this.showToastNotification("Erreur lors de l'ajout du produit.", 'error'),
      });
    }
    this.closeProductModal();
  }

  confirmDeleteProduct(productId: number): void {
    this.productToDeleteId.set(productId);
    this.confirmDeleteModal.set(true);
  }

  deleteProduct(): void {
    const productId = this.productToDeleteId();
    if (!productId) return;

    this.artisanService.deleteProduit(productId).subscribe({
      next: () => {
        this.products.update((list) => list.filter((p) => p.id !== productId));
        this.showToastNotification('Produit supprimé de votre catalogue.', 'success');
      },
      error: () => this.showToastNotification('Erreur lors de la suppression du produit.', 'error'),
    });
    this.confirmDeleteModal.set(false);
    this.productToDeleteId.set(null);
  }

  cancelDeleteProduct(): void {
    this.confirmDeleteModal.set(false);
    this.productToDeleteId.set(null);
  }

  onProductImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') this.productForm.image = reader.result;
    };
    reader.readAsDataURL(file);
  }

  prevProductPage(): void {
    if (this.currentPage() > 1) this.currentPage.update((p) => p - 1);
  }

  nextProductPage(): void {
    if (this.currentPage() < this.productPageCount()) this.currentPage.update((p) => p + 1);
  }

  openOrderDetails(order: Order): void {
    this.selectedOrder.set(order);
    this.orderDetailOpen.set(true);
  }

  closeOrderDetails(): void {
    this.orderDetailOpen.set(false);
    this.selectedOrder.set(null);
  }

  confirmOrder(orderId: number): void {
    this.artisanService.updateCommandeStatut(orderId, { statut: 'Confirmed' }).subscribe({
      next: () => {
        this.orders.update((list) =>
          list.map((o) => {
            if (o.id !== orderId) return o;
            const updated = { ...o, status: 'Confirmed' as const, paymentStatus: 'Escrow Held', timeline: [...o.timeline, 'Confirmed by artisan'] };
            if (this.selectedOrder()?.id === orderId) this.selectedOrder.set(updated);
            return updated;
          }),
        );
        this.showToastNotification('Commande confirmée.', 'success');
      },
      error: () => this.showToastNotification('Erreur lors de la confirmation.', 'error'),
    });
  }

  rejectOrder(orderId: number): void {
    this.artisanService.updateCommandeStatut(orderId, { statut: 'Rejected' }).subscribe({
      next: () => {
        this.orders.update((list) =>
          list.map((o) => {
            if (o.id !== orderId) return o;
            const updated = { ...o, status: 'Rejected' as const, paymentStatus: 'Refund Pending', timeline: [...o.timeline, 'Order rejected by artisan'] };
            if (this.selectedOrder()?.id === orderId) this.selectedOrder.set(updated);
            return updated;
          }),
        );
        this.showToastNotification('Commande rejetée.', 'success');
      },
      error: () => this.showToastNotification('Erreur lors du rejet.', 'error'),
    });
  }
}
