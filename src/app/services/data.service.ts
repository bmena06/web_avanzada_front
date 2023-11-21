import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  deleteUser(selectedUserId: number) {
    throw new Error('Method not implemented.');
  }
  updateUser(selectedUserId: number, value: any) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:5000/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // Operaciones CRUD para productos

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

  // Operaciones CRUD para roles

  getRolData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rols`);
  }

  createRol(rol: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newrol`, rol, this.httpOptions);
  }

  updateRol(id: number, updatedRol: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updaterol/${id}`, updatedRol, this.httpOptions);
  }

  deleteRol(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleterol/${id}`, this.httpOptions);
  }

  // Operaciones CRUD para usuarios

  getUsersData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  createUserData(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newuser`, user, this.httpOptions);
  }

  updateUserData(id: number, updatedUser: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateuser/${id}`, updatedUser, this.httpOptions);
  }

  deleteUserData(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteuser/${id}`, this.httpOptions);
  }
}
