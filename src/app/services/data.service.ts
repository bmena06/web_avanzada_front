import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:5000/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getProductData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newproduct`, product, this.httpOptions);
  }

  updateProduct(id: number, updatedProduct: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateproduct/${id}`, updatedProduct, this.httpOptions);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteproduct/${id}`, this.httpOptions);
  }
}
