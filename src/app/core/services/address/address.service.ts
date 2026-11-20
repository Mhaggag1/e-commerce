import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
@Service()
export class AddressService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  getAddresses(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/api/v1/addresses`);
  }

  getAddress(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/api/v1/addresses/${id}`);
  }

  addAddress(address: {
    name: string;
    details: string;
    city: string;
    phone: string;
  }): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/api/v1/addresses`, address);
  }

  removeAddress(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/api/v1/addresses/${id}`);
  }
}
