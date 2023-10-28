import { Component } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

export class LoginComponent {
  constructor(private router: Router) {}

  redirectToHome() {
    this.router.navigate(['home']); // Redirige a la ruta de inicio (en este caso, Home).
  }
}