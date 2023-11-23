import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.scss']
})
export class SesionComponent implements OnInit {
  userName: string = 'Usuario';
  roleName: string = 'Rol';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getUserDataFromLocalStorage();
  }

  private getUserDataFromLocalStorage(): void {
    // Accede directamente a las claves correspondientes en el localStorage
    const userName: string | null = localStorage.getItem('userName');
    const userRole: string | null = localStorage.getItem('userRole');

    // Verifica si las claves existen en el localStorage
    if (userName && userRole) {
      this.userName = userName;
      this.roleName = userRole;
    }
  }
}
