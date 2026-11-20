import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  verifyToken(): Observable<any> {
    return this.httpClient.get<any>(`${environment.baseUrl}/api/v1/auth/verifyToken`);
  }

  changePassword(data: {
    currentPassword: string;
    password: string;
    rePassword: string;
  }): Observable<any> {
    return this.httpClient.put<any>(`${environment.baseUrl}/api/v1/users/changeMyPassword`, data);
  }

  updateUser(data: { name: string; email: string; phone: string }): Observable<any> {
    return this.httpClient.put<any>(`${environment.baseUrl}/api/v1/users/updateMe/`, data);
  }

  signUp(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, data);
  }
  signIn(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signin`, data);
  }

  forgetPassword(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, data);
  }

  verifyCode(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, data);
  }
}
