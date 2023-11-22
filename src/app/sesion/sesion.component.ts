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
    const userDataString: string | null = localStorage.getItem('userData');

    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log('userData:', userData);
      this.userName = userData.name;
      this.roleName = userData.role_name;
    }
  }
}
