import { CustomtranslationService } from '../../core/services/customtranslation/customtranslation.service';
import { TranslatePipe } from '@ngx-translate/core';
import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { FlowbiteService } from '../../core/services/custom-flowbit/custom-flowbite.service';

@Component({
  imports: [TranslatePipe],
  selector: 'app-navbar',
  host: { class: 'sticky top-0 z-50 block' },
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  readonly customTranslate = inject(CustomtranslationService);
  readonly isLoggedIn = signal(false);
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
    const isLoggedIn = !!localStorage.getItem('token');
    this.isLoggedIn.set(isLoggedIn);

    const savedUser = isLoggedIn ? localStorage.getItem('user') : null;
    try {
      this.user.set(savedUser ? JSON.parse(savedUser) : null);
    } catch {
      this.user.set(null);
    }
  }

  signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.checkLogin();
  }
}
