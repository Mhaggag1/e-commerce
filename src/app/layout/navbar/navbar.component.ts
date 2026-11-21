import { CustomtranslationService } from '../../core/services/customtranslation/customtranslation.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpContext } from '@angular/common/http';
import { NgxMatToastService } from 'ngx-mat-toast';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { BACKGROUND_REQUEST } from '../../core/interceptors/error/error.interceptor';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { signedInGuard } from '../../core/auth/signed-in.guard';
import { FlowbiteService } from '../../core/services/custom-flowbit/custom-flowbite.service';

@Component({
  imports: [TranslatePipe, RouterLink],
  selector: 'app-navbar',
  host: { class: 'sticky top-0 z-50 block', '(window:storage)': 'checkLogin()' },
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  readonly customTranslate = inject(CustomtranslationService);
  private readonly token = signal<string | null>(null);
  readonly isLoggedIn = computed(() => !!this.token());
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toast = inject(NgxMatToastService);
  private readonly translate = inject(TranslateService);
  private readonly background = new HttpContext().set(BACKGROUND_REQUEST, true);
  readonly cartCount = this.cartService.cartCount;
  readonly wishlistCount = this.wishlistService.wishlistCount;
  readonly user = signal<{ name?: string; email?: string } | null>(null);
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.checkLogin();
      this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.checkLogin();
        }
      });
      this.flowbiteService.loadFlowbite((flowbite) => flowbite.initFlowbite());
    });
  }

  checkLogin(): void {
    const token = localStorage.getItem('token');
    if (token !== this.token()) {
      this.token.set(token);
      this.cartCount.set(null);
      this.wishlistCount.set(null);
      if (token) this.loadInitialCounts(token);
    }
    const savedUser = this.isLoggedIn() ? localStorage.getItem('user') : null;
    try {
      this.user.set(savedUser ? JSON.parse(savedUser) : null);
    } catch {
      this.user.set(null);
    }
  }

  private loadInitialCounts(token: string): void {
    this.cartService.getLoggedUserCart(this.background).subscribe({
      next: (res) => {
        if (this.token() === token)
          this.cartCount.update(
            (count) => count ?? res.data?.products?.length ?? res.numOfCartItems ?? 0,
          );
      },
      error: (err) => {
        if (this.token() === token && err.status === 404)
          this.cartCount.update((count) => count ?? 0);
      },
    });
    this.wishlistService.getLoggedUserWishlist(this.background).subscribe({
      next: (res) => {
        if (this.token() === token)
          this.wishlistCount.update((count) => count ?? res.count ?? res.data.length);
      },
      error: (err) => {
        if (this.token() === token && err.status === 404)
          this.wishlistCount.update((count) => count ?? 0);
      },
    });
  }

  signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.checkLogin();
    this.toast.success(this.translate.instant('UI.SIGNED_OUT'));
    const route = this.router.routerState.snapshot.root.firstChild?.routeConfig;
    if (route?.canActivate?.includes(signedInGuard)) {
      this.router.navigate(['/login']);
    }
  }
}
