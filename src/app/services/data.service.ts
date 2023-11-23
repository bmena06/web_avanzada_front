import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Servicio Angular para gestionar la comunicación con la API
@Injectable({
  providedIn: 'root',
})
export class DataService {
  // URL base de la API
  private apiUrl = 'http://localhost:5000/api';

  // Constructor que inyecta el servicio HttpClient
  constructor(private http: HttpClient) {}

  // Método privado para obtener las opciones de HTTP con el token de autorización
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

  // Método privado para almacenar datos del usuario en el localStorage
  private saveUserDataToLocalStorage(userData: any): void {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  // Método para obtener datos del usuario desde el localStorage
  getUserDataFromLocalStorage(): any {
    const userDataString = localStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : null;
  }

  // Método para realizar la autenticación del usuario
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
            }
          }
        }
      })
    );
  }

  // Operaciones para productos

  // Método para obtener datos de productos
  getProductData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`, this.getHttpOptions());
  }

  // Método para crear un nuevo producto
  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newproduct`, product, this.getHttpOptions());
  }

  // Operaciones para roles

  // Método para obtener datos de roles
  getRolData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rols`, this.getHttpOptions());
  }

  // Método para crear un nuevo rol
  createRol(rol: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newrol`, rol, this.getHttpOptions());
  }

  // Operaciones para usuarios

  // Método para obtener datos de usuarios
  getUsersData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, this.getHttpOptions());
  }

  // Método para crear un nuevo usuario
  createUserData(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newuser`, user, this.getHttpOptions());
  }

  // Operaciones para paquetes

  // Método para obtener datos de paquetes
  getPackageData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/packages`, this.getHttpOptions());
  }

  // Método para crear un nuevo paquete
  createPackage(pkg: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newpackage`, pkg, this.getHttpOptions());
  }

  // Operaciones para pagos

  // Método para obtener datos de pagos
  getPaymentData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments`, this.getHttpOptions());
  }

  // Método para crear un nuevo pago
  createPaymentData(payment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newpayment`, payment, this.getHttpOptions());
  }

  // Operaciones para producciones

  // Método para obtener datos de producciones
  getProductions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productions`, this.getHttpOptions());
  }

  // Método para crear una nueva producción
  createProduction(production: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newproduction`, production, this.getHttpOptions());
  }
}
