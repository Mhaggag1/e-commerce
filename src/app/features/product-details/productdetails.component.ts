import { TranslatePipe } from '@ngx-translate/core';
import { ReviewsComponent } from '../reviews/reviews.component';
import { DecimalPipe } from '@angular/common';
import { CardComponent } from '../home/components/card/card.component';
import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { ProductsService } from '../../core/services/product/products.service';
import { Product } from '../../core/models/iproduct/product.interface';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  imports: [TranslatePipe, RouterLink, DecimalPipe, CardComponent, ReviewsComponent],
  selector: 'app-productdetails',
  styleUrl: './productdetails.component.css',
  templateUrl: './productdetails.component.html',
})
export class ProductdetailsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly productdetails = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly stars = [1, 2, 3, 4, 5];
  // Store policies are static reference content, not fields from the product API.
  readonly benefits = [
    { title: 'Free Delivery', description: 'Orders over $50', icon: 'fas fa-truck' },
    { title: '30 Days Return', description: 'Money back', icon: 'fas fa-rotate-left' },
    { title: 'Secure Payment', description: '100% Protected', icon: 'fas fa-shield-halved' },
  ];
  readonly features = [
    'Premium Quality Product',
    '100% Authentic Guarantee',
    'Fast & Secure Packaging',
    'Quality Tested',
  ];
  readonly shipping = [
    'Free delivery for orders above $50',
    'Standard shipping takes 3–5 business days',
    'Express shipping takes 1–2 business days',
    'Follow delivery progress online',
  ];
  readonly returns = [
    'Return items within 30 days',
    'Choose a refund or an exchange',
    'Defective items qualify for free return delivery',
    'Request your return online',
  ];

  readonly selectedImage = signal('');
  readonly quantity = signal(1);
  readonly shareMessage = signal('');
  readonly savedProductId = signal('');
  readonly catalog = signal<Product[]>([]);
  readonly gallery = computed(() => {
    const product = this.productdetails();
    return product ? [...new Set([product.imageCover, ...product.images].filter(Boolean))] : [];
  });
  readonly totalPrice = computed(() => (this.productdetails()?.price ?? 0) * this.quantity());
  readonly relatedProducts = computed(() => {
    const product = this.productdetails();
    return this.catalog()
      .filter((item) => item._id !== product?._id && item.category._id === product?.category._id)
      .slice(0, 8);
  });

  setQuantity(value: number): void {
    const stock = this.productdetails()?.quantity ?? 0;
    this.quantity.set(
      stock <= 0 ? 0 : Math.min(stock, Math.max(1, Math.floor(Number.isFinite(value) ? value : 1))),
    );
  }

  private readonly productTabsRoot = viewChild<ElementRef<HTMLElement>>('productTabsRoot');

  constructor() {
    // Runs only in the browser, after the API-backed @if has rendered its panels.
    afterRenderEffect((onCleanup) => {
      const root = this.productTabsRoot()?.nativeElement;
      if (!root) return;

      let cancelled = false;
      let tabs: InstanceType<(typeof import('flowbite'))['Tabs']> | undefined;
      onCleanup(() => {
        cancelled = true;
        tabs?.destroyAndRemoveInstance();
      });

      void import('flowbite').then(({ Tabs }) => {
        if (cancelled) return;
        const items = ['details', 'reviews', 'shipping'].map((id) => ({
          id: `${id}-panel`,
          triggerEl: root.querySelector<HTMLElement>(`#${id}-tab`)!,
          targetEl: root.querySelector<HTMLElement>(`#${id}-panel`)!,
        }));
        tabs = new Tabs(
          root.querySelector<HTMLElement>('#product-tabs')!,
          items,
          {
            defaultTabId: 'details-panel',
            activeClasses: 'text-emerald-700 border-emerald-600 bg-emerald-50',
            inactiveClasses:
              'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300',
          },
          { id: 'product-details-tabs', override: true },
        );
      });
    });
  }

  ngOnInit(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.catalog.set(res.data ?? []),
        error: () => this.catalog.set([]),
      });
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          this.productdetails.set(null);
          this.loading.set(true);
          this.error.set('');
          this.selectedImage.set('');
          this.quantity.set(1);
          this.shareMessage.set('');
          const id = params.get('id');

          if (!id) {
            this.error.set('UI.NO_PRODUCT');
            return of(null);
          }

          return this.productsService.getSpecificProduct(id).pipe(
            catchError(() => {
              this.error.set('UI.LOAD_ERROR');
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.productdetails.set(res?.data ?? null);
        this.setQuantity(1);
        console.log(this.productdetails());

        if (!res?.data && !this.error()) {
          this.error.set('UI.NOT_FOUND');
        }
        this.loading.set(false);
      });
  }

  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  addProductToWishlist(productId: string): void {
    this.wishlistService.addProductToWishlist(productId).subscribe({
      next: () => {
        this.savedProductId.set(productId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addProductToCart(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
