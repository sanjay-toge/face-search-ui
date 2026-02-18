import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // baseUrl = 'http://localhost:5081/api/search'; // .NET API URL

  baseUrl = 'http://faceme-d8hke7cmcthggwag.centralindia-01.azurewebsites.net/api/search'; // .NET API URL

  constructor(private http: HttpClient) { }

  search(file: File, email: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    return this.http.post(this.baseUrl, formData);
  }

  createCheckoutSession(email: string) {
    return this.http.post('http://faceme-d8hke7cmcthggwag.centralindia-01.azurewebsites.net/api/billing/checkout', { email });
  }
}
