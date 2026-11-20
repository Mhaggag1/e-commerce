import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  getAllProducts(params: Record<string, string> = {}): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`, { params });
  }

  getSpecificProduct(productId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${productId}`);
  }
}
