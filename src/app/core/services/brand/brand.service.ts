import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
@Service()
export class BrandService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  getAllBrands(page = 1): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/api/v1/brands`, { params: { page } });
  }

  getSpecificBrand(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/api/v1/brands/${id}`);
  }
}
