import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

// Componente Angular para gestionar roles
@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss'],
})
export class RolComponent implements OnInit, OnDestroy {
  // Propiedad para almacenar datos de roles
  rolData: any;

  // Configuración para DataTables
  dtoptions: DataTables.Settings = {};

  // Observable para notificar cambios en datos a DataTables
  dtTrigger: Subject<any> = new Subject<any>();

  // Formulario reactivo para la creación de nuevos roles
  newRolForm: FormGroup;

  // Identificador del rol seleccionado (si hay alguno)
  selectedRoleId: number | null = null;

  // Elemento de DataTables obtenido mediante ViewChild
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  // Constructor del componente
  constructor(private dataService: DataService, private fb: FormBuilder) {
    // Inicializa el formulario reactivo con validaciones
    this.newRolForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      compensation: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  // Método ejecutado al inicializar el componente
  ngOnInit(): void {
    // Configuración de DataTables
    this.dtoptions = {
      scrollY: 300,
      language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    },
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 10,
    };

    // Inicializa DataTables y carga datos de roles
    this.dtTrigger.next(null);
    this.loadRolData();
  }

  // Método ejecutado al destruir el componente
  ngOnDestroy(): void {
    // Cancela la suscripción a eventos de DataTables
    this.dtTrigger.unsubscribe();
  }

  // Carga los datos de roles desde el servicio
  loadRolData() {
    this.dataService.getRolData().subscribe((data) => {
      // Actualiza DataTables con nuevos datos
      if (this.dtElement) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Limpia la tabla antes de agregar nuevos datos
          dtInstance.clear();

          // Verifica y formatea los datos para DataTables
          const formattedData = data.roles.map((rol: { id: any; name: any; compensation: any; }) => [rol.id, rol.name, rol.compensation]);

          // Agrega los datos formateados y dibuja la tabla
          dtInstance.rows.add(formattedData);
          dtInstance.draw();
        });
      }
    });
  }

  // Método para crear un nuevo rol
  createRol() {
    if (this.newRolForm.valid) {
      // Imprime en consola el inicio del proceso de creación
      console.log('Creando rol...', this.newRolForm.value);
      
      // Llama al servicio para crear el rol
      this.dataService.createRol(this.newRolForm.value).subscribe(
        () => {
          // Imprime en consola el éxito en la creación
          console.log('Rol creado con éxito');
          
          // Reinicia el formulario y recarga los datos de roles
          this.newRolForm.reset();
          this.loadRolData();
        },
        (error) => {
          // Imprime en consola en caso de error en la creación
          console.error('Error al crear el rol:', error);
  
          // Muestra una alerta en caso de un error específico
          if (error.status === 400 && error.error?.mensaje) {
            alert(`Error: ${error.error.mensaje}`);
          }
        }
      );
    } else {
      // Alerta si el formulario no es válido y resalta visualmente los campos inválidos
      alert('Debes llenar todos los campos y que sean correctos para la creación del rol');
      Object.keys(this.newRolForm.controls).forEach(key => {
        const control = this.newRolForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
          control?.setErrors({ 'invalid': true });
        }
      });
    }
  }
}
