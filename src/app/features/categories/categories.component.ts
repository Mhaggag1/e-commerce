import { Category } from '../../core/models/icategory/category.interface';
import { RouterLink } from '@angular/router';
import { CategoryListService } from '../../core/services/category-list/category-list.service';
import { forkJoin, of } from 'rxjs';
import { Component, inject, signal } from '@angular/core';
@Component({
  imports: [RouterLink],
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  private readonly service = inject(CategoryListService);
  readonly categories = signal<Category[]>([]);
  readonly selected = signal<Category | null>(null);
  readonly subcategories = signal<{ _id: string; name: string }[]>([]);
  readonly subcategory = signal<{ _id: string; name: string } | null>(null);
  readonly busy = signal(false);
  readonly message = signal('');
  page = 1;
  pages = 1;
  ngOnInit(): void {
    this.service
      .getAllCategories()
      .subscribe({
        next: (res) => this.categories.set(res.data),
        error: () => this.message.set('Could not load categories.'),
      });
    this.getSubcategories();
  }
  getSubcategories(categoryId = '', page = 1): void {
    this.busy.set(true);
    this.message.set('');
    this.subcategory.set(null);
    const category = categoryId ? this.service.getSpecificCategory(categoryId) : of({ data: null });
    const list = categoryId
      ? this.service.getCategorySubcategories(categoryId, page)
      : this.service.getSubcategories(page);
    forkJoin({ category, list }).subscribe({
      next: (res) => {
        this.selected.set(res.category.data);
        this.subcategories.set(res.list.data);
        this.page = page;
        this.pages = res.list.metadata?.numberOfPages || 1;
        this.busy.set(false);
      },
      error: () => {
        this.message.set('Could not load subcategories.');
        this.busy.set(false);
      },
    });
  }
  showSubcategory(id: string): void {
    this.busy.set(true);
    this.service.getSubcategory(id).subscribe({
      next: (res) => {
        this.subcategory.set(res.data);
        this.busy.set(false);
      },
      error: () => {
        this.message.set('Could not load subcategory.');
        this.busy.set(false);
      },
    });
  }
}
