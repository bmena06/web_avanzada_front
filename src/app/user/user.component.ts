import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

// Componente Angular para gestionar usuarios
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  // Propiedad para almacenar datos de usuario
  userData: any;

  // Configuración para DataTables
  dtoptions: DataTables.Settings = {};

  // Observable para notificar cambios en datos a DataTables
  dtTrigger: Subject<any> = new Subject<any>();

  // Formulario reactivo para la creación de nuevos usuarios
  newUserForm: FormGroup;

  // Elemento de DataTables obtenido mediante ViewChild
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  // Constructor del componente
  constructor(private dataService: DataService, private fb: FormBuilder) {
    // Inicializa el formulario reactivo con validaciones
    this.newUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rol_name: ['', [Validators.required]],
    });
  }

  // Método ejecutado al inicializar el componente
  ngOnInit(): void {
    // Configuración de DataTables
    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: 'Buscar Usuarios',
      },
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 9,
    };

    // Inicializa DataTables y carga datos de usuario
    this.dtTrigger.next(null);
    this.loadUserData();
  }

  // Método ejecutado al destruir el componente
  ngOnDestroy(): void {
    // Cancela la suscripción a eventos de DataTables
    this.dtTrigger.unsubscribe();
  }

  // Carga los datos de usuario desde el servicio
  loadUserData() {
    this.dataService.getUsersData().subscribe(data => {
      // Actualiza DataTables con nuevos datos
      if (this.dtElement) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Limpia la tabla antes de agregar nuevos datos
          dtInstance.clear();
  
          // Verifica y formatea los datos para DataTables
          const formattedData = data.usuarios.map((user: { id: any; name: any; email: any; password: any; rol_name: any }) => [user.id, user.name, user.email, user.password, user.rol_name]);
  
          // Agrega los datos formateados y dibuja la tabla
          dtInstance.rows.add(formattedData);
          dtInstance.draw();
        });
      }
    });
  }

  // Método para crear un nuevo usuario
  createUser() {
    if (this.newUserForm.valid) {
      // Imprime en consola el inicio del proceso de creación
      console.log('Creando usuario...', this.newUserForm.value);
      
      // Llama al servicio para crear el usuario
      this.dataService.createUserData(this.newUserForm.value).subscribe(
        () => {
          // Imprime en consola el éxito en la creación
          console.log('Usuario creado con éxito');
          
          // Reinicia el formulario y recarga los datos de usuario
          this.newUserForm.reset();
          this.loadUserData();
        },
        (error) => {
          // Imprime en consola en caso de error en la creación
          console.error('Error al crear el usuario:', error);
        }
      );
    } else {
      // Alerta si el formulario no es válido y resalta visualmente los campos inválidos
      alert('Debes llenar todos los campos y que sean correctos para la creación del usuario');
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
