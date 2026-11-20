import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ReviewForm } from '../../models/review.interface';
@Service()
export class ReviewService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  getProductReviews(productId: string, page = 1): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/api/v1/products/${productId}/reviews`, {
      params: { page },
    });
  }

  getAllReviews(page = 1): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/reviews`, { params: { page } });
  }

  getReview(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/api/v1/reviews/${id}`);
  }

  addReview(productId: string, data: ReviewForm): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/api/v1/products/${productId}/reviews`, data);
  }

  updateReview(id: string, data: ReviewForm): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/api/v1/reviews/${id}`, data);
  }

  deleteReview(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/api/v1/reviews/${id}`);
  }
}
