import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { ProductsService } from '../../core/services/product/products.service';
import { Product } from '../../core/models/iproduct/product.interface';
import { CategoriesComponent } from '../categories/categories.component';
import { CategoryListService } from '../../core/services/category-list/category-list.service';
import { Category } from '../../core/models/icategory/category.interface';

@Component({
  imports: [TranslatePipe, CardComponent],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  // *dependency Injections
  private readonly productsService = inject(ProductsService);
  private readonly categoryListService = inject(CategoryListService);

  // *Properties

  productList: WritableSignal<Product[]> = signal([]);
  categorylist: WritableSignal<Category[]> = signal([]);

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
  }

  getAllProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
        console.log(this.productList());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllCategories() {
    this.categoryListService.getAllCategories().subscribe({
      next: (res) => {
        this.categorylist.set(res.data);
        console.log(this.categorylist());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
