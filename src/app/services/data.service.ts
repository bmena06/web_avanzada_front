import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:5000/api';
  private userId = 'userid';

  constructor(private http: HttpClient) {}

  private getHttpOptions(): any {
    // Recuperar el token del localStorage
    const token: string | null = localStorage.getItem('token');

    // Incluir el token en las cabeceras
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `"Bearer ${token}"`, // Agregar el token a la cabecera de autorización
      }),
    };
    return httpOptions;
  }

  private saveUserDataToLocalStorage(userData: any): void {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  getUserDataFromLocalStorage(): any {
  const userDataString = localStorage.getItem('userData');
  return userDataString ? JSON.parse(userDataString) : null;
  }

  

  login(credentials: { name: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, this.getHttpOptions()).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const token = event.body?.token;

          if (token) {
            // Almacena el token en localStorage
            localStorage.setItem('token', token);

            // Almacena los datos del usuario en localStorage
            const userData = event.body?.user;
            if (userData) {
              this.saveUserDataToLocalStorage(userData);
              this.userId = userData.id;            }
          }
        }
      })
    );
  }

  getProductData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`, this.getHttpOptions(), );
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newproduct`, product, this.getHttpOptions());
  }

  updateProduct(id: number, updatedProduct: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateproduct/${id}`, updatedProduct, this.getHttpOptions());
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteproduct/${id}`, this.getHttpOptions());
  }

  // Operaciones CRUD para roles

  getRolData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rols`, this.getHttpOptions());
  }

  createRol(rol: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newrol`, rol, this.getHttpOptions());
  }

  updateRol(id: number, updatedRol: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updaterol/${id}`, updatedRol, this.getHttpOptions());
  }

  deleteRol(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleterol/${id}`, this.getHttpOptions());
  }

  // Operaciones CRUD para usuarios

  getUsersData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, this.getHttpOptions());
  }

  createUserData(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newuser`, user, this.getHttpOptions());
  }

  updateUserData(id: number, updatedUser: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateuser/${id}`, updatedUser, this.getHttpOptions());
  }

  deleteUserData(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteuser/${id}`, this.getHttpOptions());
  }

  // Operaciones CRUD para paquetes

  getPackageData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/packages`, this.getHttpOptions());
  }

  createPackage(pkg: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newpackage`, pkg, this.getHttpOptions());
  }

  updatePackage(id: number, updatedPackage: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatepackage/${id}`, updatedPackage, this.getHttpOptions());
  }

  deletePackage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletepackage/${id}`, this.getHttpOptions());
  }


    // Operaciones CRUD para pagos

  getPaymentData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments`, this.getHttpOptions());
  }
  
  createPaymentData(payment: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/newpayment`, payment, this.getHttpOptions());
  }
  
  updatePaymentData(id: number, updatedPayment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatepayment/${id}`, updatedPayment, this.getHttpOptions());
  }
  
  deletePaymentData(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletepayment/${id}`, this.getHttpOptions());
  }


  //PRODUCCIONES
  getProductions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productions`, this.getHttpOptions());
  }
  


  createProduction(production: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newproduction`, production, this.getHttpOptions());
  }

}


