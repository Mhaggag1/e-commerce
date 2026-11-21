import { TranslatePipe } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [TranslatePipe, RouterLink],
  selector: 'app-footer',
  styleUrl: './footer.component.css',
  templateUrl: './footer.component.html',
})
export class FooterComponent {}
