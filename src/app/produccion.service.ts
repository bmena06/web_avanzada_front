// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:5000/api/productions'; // Reemplaza con la URL de tu backend Flask
  
  constructor(private http: HttpClient) {}

  getDatos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productions`); // Reemplaza "tudataendpoint" con la ruta real de tu endpoint
  }
}
