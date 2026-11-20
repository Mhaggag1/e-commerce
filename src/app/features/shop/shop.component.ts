import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { CardComponent } from '../home/components/card/card.component';
import { CategoryListService } from '../../core/services/category-list/category-list.service';
import { ProductsService } from '../../core/services/product/products.service';
import { Product } from '../../core/models/iproduct/product.interface';
import { Category } from '../../core/models/icategory/category.interface';

@Component({
  imports: [TranslatePipe, CardComponent, RouterLink],
  selector: 'app-shop',
  styleUrl: './shop.component.css',
  templateUrl: './shop.component.html',
})
export class ShopComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoryListService);
  readonly products = signal<Product[]>([]);
  readonly message = signal('');
  page = 1;
  pages = 1;

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        switchMap((query) => {
          this.message.set('Loading products…');
          this.products.set([]);
          this.pages = 1;
          this.page = Math.max(1, Number(query.get('page')) || 1);
          const params: Record<string, string> = { page: String(this.page) };
          const search = query.get('search');
          const brand = query.get('brand');
          const subcategory = query.get('subcategory');
          const category = query.get('category');
          if (search) params['keyword'] = search;
          if (brand) params['brand'] = brand;
          if (subcategory) params['subcategory'] = subcategory;
          let request;
          if (category && !/^[a-f0-9]{24}$/i.test(category)) {
            request = this.categoriesService.getAllCategories().pipe(
              switchMap((res) => {
                const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
                const found = res.data.find((item: Category) => slug(item.slug) === slug(category));
                return found
                  ? this.productsService.getAllProducts({ ...params, category: found._id })
                  : of({ data: [] });
              }),
            );
          } else {
            if (category) params['category'] = category;
            request = this.productsService.getAllProducts(params);
          }
          return request.pipe(catchError(() => of(null)));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.products.set(res?.data || []);
        this.pages = res?.metadata?.numberOfPages || 1;
        this.message.set(
          !res ? 'Could not load products.' : res.data.length ? '' : 'No products found.',
        );
      });
  }
}
