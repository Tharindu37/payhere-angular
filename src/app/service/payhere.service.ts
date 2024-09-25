import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PayhereService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:3000/hash';

  constructor() {}

  generateHash(
    orderId: string,
    amount: string,
    currency: string
  ): Observable<string> {
    const data = {
      orderId: orderId,
      amount: amount,
      currency: currency,
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiURL, data, { headers });
  }
}
