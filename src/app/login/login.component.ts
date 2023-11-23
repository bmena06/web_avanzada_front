import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  credentials = {
    name: '',
    password: '',
  };

  constructor(private authService: DataService, private router: Router) {}

  login() {
    console.log('Credenciales enviadas:', this.credentials);
    // Llama al servicio de autenticación
    this.authService.login(this.credentials)
      .pipe(
        tap(
          (response) => {
            // Aquí puedes acceder al token en la respuesta
            const token = response.token;
            console.log('Login successful', response);
            // Guarda el token en localStorage o donde lo necesites
            if (token) {
              localStorage.setItem('token', token);
              // Guarda el nombre y el rol en localStorage
              localStorage.setItem('userName', response.user.name);
              localStorage.setItem('userRole', response.user.role_name);
              localStorage.setItem('user_id', response.user.id);
              console.log(localStorage)
            }
  
            // Redirige al usuario a la ruta '/home' después de un inicio de sesión exitoso
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Login failed', error);
            // Puedes agregar lógica para manejar errores aquí, por ejemplo, mostrar un mensaje de error al usuario.
          }
        )
      )
      .subscribe(); // Mantén la suscripción aquí si realmente necesitas suscribirte al observable.
  }
}  
