import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class CategoryListService {
  private readonly httpClient = inject(HttpClient);

  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories`);
  }

  getSubcategories(page = 1): Observable<any> {
    return this.httpClient.get<any>(`${environment.baseUrl}/api/v1/subcategories`, {
      params: { page },
    });
  }

  getCategorySubcategories(categoryId: string, page = 1): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.baseUrl}/api/v1/categories/${categoryId}/subcategories`,
      { params: { page } },
    );
  }

  getSubcategory(id: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.baseUrl}/api/v1/subcategories/${id}`);
  }

  getSpecificCategory(categoryId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories/${categoryId}`);
  }
}
