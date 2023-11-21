import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

declare var $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  userData: any;
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  newUserForm: FormGroup;

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.newUserForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rol_name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: 'Buscar Usuarios',
      },
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 9,
    };

    // Inicializa DataTables en el evento ngOnInit
    this.dtTrigger.next(null);

    // Llama a la carga de datos después de inicializar DataTables
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  loadUserData() {
    this.dataService.getUsersData().subscribe(data => {
      // Actualiza DataTables con nuevos datos
      if (this.dtElement) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Limpia la tabla antes de agregar nuevos datos
          dtInstance.clear();
  
          // Verifica que los datos estén en el formato esperado por DataTables
          const formattedData = data.usuarios.map((user: { id: any; name: any; email: any; password: any; rol_name: any }) => [user.id, user.name, user.email, user.password, user.rol_name]);
  
          dtInstance.rows.add(formattedData);
          dtInstance.draw();
        });
      }
    });
  }
  
  
  
  

  createUser() {
    if (this.newUserForm.valid) {
      console.log('Creando usuario...', this.newUserForm.value);
      this.dataService.createUserData(this.newUserForm.value).subscribe(
        () => {
          console.log('Usuario creado con éxito');
          this.newUserForm.reset();
          // Mover la carga de datos aquí para garantizar que se actualice después de la creación exitosa
          this.loadUserData();
        },
        (error) => {
          console.error('Error al crear el usuario:', error);
        }
      );
    } else {
      alert('Debes llenar todos los campos y que sean correctos para la creación del usuario');
      // Resalta visualmente los campos inválidos
      Object.keys(this.newUserForm.controls).forEach(key => {
        const control = this.newUserForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
          control?.setErrors({ 'invalid': true });
        }
      });
    }
  }
}
