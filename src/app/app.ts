import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { register } from 'swiper/element/bundle';
import { TranslateService } from '@ngx-translate/core';
import { CustomtranslationService } from './core/services/customtranslation/customtranslation.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  imports: [TranslatePipe, RouterOutlet, NavbarComponent, FooterComponent, NgxSpinnerComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('e-commerce');
  private readonly translate = inject(TranslateService);
  private readonly customTranslate = inject(CustomtranslationService);

  constructor() {
    this.translate.addLangs(['ar', 'en']);
    this.customTranslate.initialize();
  }
  ngOnInit() {
    register();
  }
}
