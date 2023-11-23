import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  sidebarShow: boolean = false;
  activeLink: string = '';
  constructor(private authService: DataService, private router: Router) {}

  logout(): void {
    // Limpia el local storage y redirige al componente de inicio de sesión
    this.authService.logout();
    this.router.navigate(['/']);
  }
}