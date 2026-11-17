import { CustomtranslationService } from '../../core/services/customtranslation/customtranslation.service';
import { TranslatePipe } from '@ngx-translate/core';
import { afterNextRender, Component, inject } from '@angular/core';
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
  private readonly flowbiteService = inject(FlowbiteService);

  constructor() {
    afterNextRender(() => {
      this.flowbiteService.loadFlowbite((flowbite) => flowbite.initFlowbite());
    });
  }
}
