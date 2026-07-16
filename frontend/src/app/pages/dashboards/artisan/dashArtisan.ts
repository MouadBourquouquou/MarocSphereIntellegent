import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  computed,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';

interface ArtisanProfile {
  id: string;
  name: string;
  role: string;
  workshop: string;
  category: string;
  biography: string;
  contact: string;
  phone: string;
  location: string;
  avatar: string;
  banner: string;
}

interface Product {
  id: string;
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
  id: string;
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
export class dashboardArtisan implements AfterViewInit, OnDestroy {
  showAllServices = signal(false);
  profileEdit = signal(false);
  profile = signal<ArtisanProfile>({
    id: 'artisan-001',
    name: 'Alami Zellige Workshop',
    role: 'Master Ceramic & Clay Artisan',
    workshop: 'Sidi Ghanem Studio',
    category: 'Zellige & Ceramic',
    biography:
      'Preserving the authentic 12th-century Moorish zellige art with hand-cut geometric tiles in the heart of Marrakech.',
    contact: 'contact@alamizellige.com',
    phone: '+212 6 12 34 56 78',
    location: 'Sidi Ghanem, Marrakech',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    banner:
      'https://uxmagic.blob.core.windows.net/public/agent-images/artisan-banner-1783967641773-ereo64iln1k.png',
  });

  profileForm!: ArtisanProfile;
  productForm!: ProductForm;
  profileImagePreview = signal(this.profile().avatar);
  profileBannerPreview = signal(this.profile().banner);

  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');
  showToast = signal(false);
  toastTimeout: ReturnType<typeof setTimeout> | null = null;

  productModalOpen = signal(false);
  productModalMode = signal<'add' | 'edit' | 'view'>('add');
  editingProductId = signal<string | null>(null);
  productToDeleteId = signal<string | null>(null);
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

  products = signal<Product[]>([
    {
      id: 'prod-1',
      name: 'Handcrafted Fez Brass Lantern',
      description:
        'Elegant brass lantern with traditional Moroccan filigree work and hand-finished glass panels.',
      category: 'Metalwork',
      price: 2450,
      stock: 12,
      availability: 'In Stock',
      rating: 4.9,
      orders: 28,
      image:
        'https://uxmagic.blob.core.windows.net/public/project-documents/6a538432fd3ef5a9b6ba05a9/amiraamiiraa390_gmail.com/1783967042114-0bb39d13-Screenshot%202026-07-13%20192247.png',
      materials: 'Brass, Glass',
      process:
        'Hand-cut brass panels soldered with traditional Moroccan geometry and polished by hand.',
    },
    {
      id: 'prod-2',
      name: 'Fez Blue Geometric Zellige Tile Set',
      description:
        '12-piece, hand-painted zellige tile set with bold blue accents for statement walls or floors.',
      category: 'Ceramics',
      price: 1200,
      stock: 4,
      availability: 'Low Stock',
      rating: 4.8,
      orders: 17,
      image:
        'https://uxmagic.blob.core.windows.net/public/agent-images/artisan-banner-1783967641773-ereo64iln1k.png',
      materials: 'Ceramic, Glaze',
      process:
        'Traditional kiln-fired zellige assembled and glazed in small batches for authentic texture.',
    },
    {
      id: 'prod-3',
      name: 'Hand-stitched Leather Travel Journal',
      description:
        'Premium leather journal finished with hand-stitched pages and embossed Moroccan motifs.',
      category: 'Leatherwork',
      price: 980,
      stock: 0,
      availability: 'Out of Stock',
      rating: 4.7,
      orders: 12,
      image:
        'https://uxmagic.blob.core.windows.net/public/project-documents/6a538432fd3ef5a9b6ba05a9/amiraamiiraa390_gmail.com/1783967042114-0bb39d13-Screenshot%202026-07-13%20192247.png',
      materials: 'Leather, Cotton',
      process:
        'Stitched by hand with vegetable-tanned leather and natural thread for an heirloom finish.',
    },
  ]);

  orders = signal<Order[]>([
    {
      id: 'ORD-8932',
      customer: 'Sophia Laurent',
      contact: 'sophia.laurent@example.com',
      products: [{ name: 'Handcrafted Fez Brass Lantern', qty: 1, price: 2450 }],
      total: 2450,
      date: 'Jul 10, 2026',
      paymentStatus: 'Escrow Held',
      status: 'Pending',
      address: '42 Rue de Boucher, Paris, France',
      paymentMethod: 'Escrow Payment',
      notes: 'Please package with extra padding for shipping.',
      timeline: ['Order placed', 'Awaiting confirmation'],
    },
    {
      id: 'ORD-8935',
      customer: 'Marcus Vance',
      contact: 'marcus.vance@example.com',
      products: [{ name: 'Fez Blue Geometric Zellige Tile Set', qty: 2, price: 1200 }],
      total: 2400,
      date: 'Jul 7, 2026',
      paymentStatus: 'Released',
      status: 'Completed',
      address: '55 Hudson St, New York, USA',
      paymentMethod: 'Credit Card',
      notes: 'Customer requested express delivery.',
      timeline: ['Order placed', 'Confirmed', 'Shipped', 'Delivered'],
    },
    {
      id: 'ORD-8938',
      customer: 'Amina Hassan',
      contact: 'amina.hassan@example.com',
      products: [{ name: 'Hand-stitched Leather Travel Journal', qty: 3, price: 980 }],
      total: 2940,
      date: 'Jul 12, 2026',
      paymentStatus: 'Escrow Held',
      status: 'Pending',
      address: '18 Atlas Street, Casablanca, Morocco',
      paymentMethod: 'Escrow Payment',
      notes: 'Gift wrap the journal set if possible.',
      timeline: ['Order placed', 'Awaiting confirmation'],
    },
  ]);

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
      if (sort === 'price-asc') {
        return a.price - b.price;
      }
      if (sort === 'price-desc') {
        return b.price - a.price;
      }
      return b.orders - a.orders;
    });
  });

  productPageCount = computed(() => {
    return Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize));
  });

  currentProductPage = computed(() => {
    const page = this.currentPage();
    return Math.min(page, this.productPageCount());
  });

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
        [order.id, order.customer, order.contact, order.paymentMethod, order.address]
          .join(' ')
          .toLowerCase()
          .includes(query);
      const filterMatch = filter === 'all' || order.status.toLowerCase() === filter;

      return queryMatch && filterMatch;
    });
  });

  totalProducts = computed(() => this.products().length);
  pendingOrders = computed(
    () => this.orders().filter((order) => order.status === 'Pending').length,
  );
  confirmedOrders = computed(
    () => this.orders().filter((order) => order.status === 'Confirmed').length,
  );
  completedOrders = computed(
    () => this.orders().filter((order) => order.status === 'Completed').length,
  );
  revenue = computed(() => this.orders().reduce((sum, order) => sum + order.total, 0));
  averageRating = computed(() => {
    const products = this.products();
    if (!products.length) {
      return '0.0';
    }
    return (products.reduce((sum, product) => sum + product.rating, 0) / products.length)
      .toFixed(1)
      .toString();
  });
  customerCount = computed(() => new Set(this.orders().map((order) => order.customer)).size);

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
      id: '',
      name: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      availability: 'In Stock',
      rating: '4.9',
      orders: '0',
      image: '',
      materials: '',
      process: '',
    };
  }

  // ==========================
  // Lifecycle
  // ==========================
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.setupSmoothScroll();
    this.setupFormPreventDefault();
    this.initArtisanSalesChart();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];

    if (this.chartTimeoutId !== null) {
      clearTimeout(this.chartTimeoutId);
    }

    if (this.toastTimeout !== null) {
      clearTimeout(this.toastTimeout);
    }

    this.chart?.destroy();
  }

  // ==========================
  // Smooth Scroll
  // ==========================
  private setupSmoothScroll(): void {
    const anchors = this.elRef.nativeElement.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    anchors.forEach((anchor) => {
      const onClick = (event: Event): void => {
        const href = anchor.getAttribute('href');

        if (!href) return;

        const target = this.elRef.nativeElement.querySelector<HTMLElement>(href);

        if (target) {
          event.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      };

      anchor.addEventListener('click', onClick);
      this.cleanupFns.push(() => anchor.removeEventListener('click', onClick));
    });
  }

  // ==========================
  // Prevent Form Submit
  // ==========================
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

  // ==========================
  // Chart.js
  // ==========================
  private initArtisanSalesChart(): void {
    this.chartTimeoutId = setTimeout(() => {
      const canvas =
        this.elRef.nativeElement.querySelector<HTMLCanvasElement>('#artisanSalesChart');

      if (!canvas) return;

      Chart.register(...registerables);

      this.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            {
              label: 'Revenue (MAD)',
              data: [32000, 45000, 41000, 58000, 62000, 68400],
              borderColor: '#006233',
              backgroundColor: 'rgba(0, 98, 51, 0.05)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              grid: {
                color: 'rgba(234, 223, 201, 0.2)',
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }, 100);
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

    root.querySelectorAll<HTMLElement>('.dash-tab-pane').forEach((pane) => {
      pane.classList.add('hidden');
    });

    root.querySelector<HTMLElement>(`#${tabId}-content`)?.classList.remove('hidden');
  }

  enableProfileEdit(): void {
    this.profileForm = { ...this.profile() };
    this.profileImagePreview.set(this.profile().avatar);
    this.profileBannerPreview.set(this.profile().banner);
    this.profileEdit.set(true);
  }

  saveProfile(): void {
    this.profile.set({ ...this.profileForm });
    this.profileImagePreview.set(this.profileForm.avatar);
    this.profileBannerPreview.set(this.profileForm.banner);
    this.profileEdit.set(false);
    this.showToastNotification('Your artisan profile was updated successfully.', 'success');
  }

  cancelProfileEdit(): void {
    this.profileForm = { ...this.profile() };
    this.profileImagePreview.set(this.profile().avatar);
    this.profileBannerPreview.set(this.profile().banner);
    this.profileEdit.set(false);
  }

  onProfileImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.profileImagePreview.set(reader.result);
        this.profileForm.avatar = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  onProfileBannerChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.profileBannerPreview.set(reader.result);
        this.profileForm.banner = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  private showToastNotification(message: string, type: 'success' | 'error'): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);
    this.toastTimeout = setTimeout(() => {
      this.showToast.set(false);
    }, 3200);
  }

  openProductModal(mode: 'add' | 'edit' | 'view', product?: Product): void {
    this.productModalMode.set(mode);
    this.editingProductId.set(product?.id ?? null);
    this.selectedProduct.set(mode === 'view' ? (product ?? null) : null);

    if (product) {
      this.productForm = {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        availability: product.availability,
        rating: product.rating.toString(),
        orders: product.orders.toString(),
        image: product.image,
        materials: product.materials,
        process: product.process,
      };
    } else {
      this.productForm = {
        id: '',
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '1',
        availability: 'In Stock',
        rating: '4.9',
        orders: '0',
        image: '',
        materials: '',
        process: '',
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
      this.showToastNotification('Please enter a product name and category.', 'error');
      return;
    }

    const price = Number(this.productForm.price) || 0;
    const stock = Number(this.productForm.stock) || 0;
    const rating = Number(this.productForm.rating) || 0;
    const orders = Number(this.productForm.orders) || 0;
    const product: Product = {
      id: this.productForm.id || `prod-${Date.now()}`,
      name: this.productForm.name.trim(),
      description: this.productForm.description.trim(),
      category: this.productForm.category.trim(),
      price,
      stock,
      availability: this.productForm.availability,
      rating,
      orders,
      image:
        this.productForm.image ||
        'https://uxmagic.blob.core.windows.net/public/project-documents/placeholder-artisan.png',
      materials: this.productForm.materials.trim(),
      process: this.productForm.process.trim(),
    };

    if (this.productModalMode() === 'edit' && this.editingProductId()) {
      this.products.update((list) => list.map((item) => (item.id === product.id ? product : item)));
      this.showToastNotification('Product updated successfully.', 'success');
    } else {
      this.products.update((list) => [product, ...list]);
      this.showToastNotification('Product added to your catalog.', 'success');
    }

    this.closeProductModal();
  }

  confirmDeleteProduct(productId: string): void {
    this.productToDeleteId.set(productId);
    this.confirmDeleteModal.set(true);
  }

  deleteProduct(): void {
    const productId = this.productToDeleteId();
    if (!productId) {
      return;
    }

    this.products.update((list) => list.filter((product) => product.id !== productId));
    this.showToastNotification('Product removed from your catalog.', 'success');
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
      if (typeof reader.result === 'string') {
        this.productForm.image = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  prevProductPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  nextProductPage(): void {
    if (this.currentPage() < this.productPageCount()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  openOrderDetails(order: Order): void {
    this.selectedOrder.set(order);
    this.orderDetailOpen.set(true);
  }

  closeOrderDetails(): void {
    this.orderDetailOpen.set(false);
    this.selectedOrder.set(null);
  }

  confirmOrder(orderId: string): void {
    this.orders.update((list) =>
      list.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        const updated = {
          ...order,
          status: 'Confirmed' as const,
          paymentStatus: 'Escrow Held',
          timeline: [...order.timeline, 'Confirmed by artisan'],
        };

        if (this.selectedOrder()?.id === orderId) {
          this.selectedOrder.set(updated);
        }

        return updated;
      }),
    );
    this.showToastNotification('Order confirmed and moved to Confirmed Orders.', 'success');
  }

  rejectOrder(orderId: string): void {
    this.orders.update((list) =>
      list.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        const updated = {
          ...order,
          status: 'Rejected' as const,
          paymentStatus: 'Refund Pending',
          timeline: [...order.timeline, 'Order rejected by artisan'],
        };

        if (this.selectedOrder()?.id === orderId) {
          this.selectedOrder.set(updated);
        }

        return updated;
      }),
    );
    this.showToastNotification('Order rejected and customer notified.', 'success');
  }
}
