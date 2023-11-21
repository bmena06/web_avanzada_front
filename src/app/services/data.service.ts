import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
}

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

  // Recuperar el token del localStorage
  private token: string | null = localStorage.getItem('token');

  // Incluir el token en las cabeceras
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`, // Agregar el token a la cabecera de autorización
    }),
  };

  constructor(private http: HttpClient) {}

  login(credentials: { name: string; password: string }): Observable<LoginResponse> {
    console.log(credentials);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, this.httpOptions).pipe(
      tap((response) => {
        const token = response.token;

        if (token) {
          // Almacena el token en localStorage
          localStorage.setItem('token', token);
          // Actualiza el token en las cabeceras después de iniciar sesión
          this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
        }
      })
    );
  }


  getProductData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`, this.httpOptions);
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
    return this.http.get(`${this.apiUrl}/rols`, this.httpOptions);
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

  // Operaciones CRUD para paquetes

  getPackageData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/packages`);
  }

  createPackage(pkg: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newpackage`, pkg, this.httpOptions);
  }

  updatePackage(id: number, updatedPackage: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatepackage/${id}`, updatedPackage, this.httpOptions);
  }

  deletePackage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletepackage/${id}`, this.httpOptions);
  }
}



