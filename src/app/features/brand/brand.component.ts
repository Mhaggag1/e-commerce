import { Category } from '../../core/models/icategory/category.interface';
import { RouterLink } from '@angular/router';
import { BrandService } from '../../core/services/brand/brand.service';
import { Component, inject, signal } from '@angular/core';
@Component({
  imports: [RouterLink],
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
})
export class BrandComponent {
  private readonly brandService = inject(BrandService);
  readonly brands = signal<Category[]>([]);
  readonly selected = signal<Category | null>(null);
  readonly message = signal('');
  readonly busy = signal(false);
  page = 1;
  pages = 1;
  ngOnInit(): void {
    this.getBrands(1);
  }
  getBrands(page: number): void {
    this.busy.set(true);
    this.message.set('');
    this.selected.set(null);
    this.brandService.getAllBrands(page).subscribe({
      next: (res) => {
        this.brands.set(res.data);
        this.page = page;
        this.pages = res.metadata?.numberOfPages || 1;
        this.busy.set(false);
      },
      error: () => {
        this.message.set('Could not load brands.');
        this.busy.set(false);
      },
    });
  }
  getBrand(id: string): void {
    this.busy.set(true);
    this.message.set('');
    this.brandService.getSpecificBrand(id).subscribe({
      next: (res) => {
        this.selected.set(res.data);
        this.busy.set(false);
      },
      error: () => {
        this.message.set('Could not load this brand.');
        this.busy.set(false);
      },
    });
  }
}
