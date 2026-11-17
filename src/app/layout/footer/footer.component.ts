import { TranslatePipe } from '@ngx-translate/core';
import { Component } from '@angular/core';

@Component({
  imports: [TranslatePipe],
  selector: 'app-footer',
  styleUrl: './footer.component.css',
  templateUrl: './footer.component.html',
})
export class FooterComponent {}
