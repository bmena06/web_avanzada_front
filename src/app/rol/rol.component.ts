import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

declare var $: any;

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss'],
})
export class RolComponent implements OnInit, OnDestroy {
  rolData: any;
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  newRolForm: FormGroup;
  selectedRoleId: number | null = null;

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.newRolForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      compensation: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  ngOnInit(): void {
    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: 'Buscar roles',
      },
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 9,
    };

    // Inicializa DataTables en el evento ngOnInit
    this.dtTrigger.next(null);

    // Llama a la carga de datos después de inicializar DataTables
    this.loadRolData();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  loadRolData() {
    this.dataService.getRolData().subscribe((data) => {
      // Actualiza DataTables con nuevos datos
      if (this.dtElement) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Limpia la tabla antes de agregar nuevos datos
          dtInstance.clear();

          // Verifica que los datos estén en el formato esperado por DataTables
          const formattedData = data.roles.map((rol: { id: any; name: any; compensation: any; }) => [rol.id, rol.name, rol.compensation]);

          dtInstance.rows.add(formattedData);
          dtInstance.draw();
        });
      }
    });
  }

  createRol() {
    if (this.newRolForm.valid) {
      console.log('Creando rol...', this.newRolForm.value);
      this.dataService.createRol(this.newRolForm.value).subscribe(
        () => {
          console.log('Rol creado con éxito');
          this.newRolForm.reset();
          // Mover la carga de datos aquí para garantizar que se actualice después de la creación exitosa
          this.loadRolData();
        },
        (error) => {
          console.error('Error al crear el rol:', error);
  
          if (error.status === 400 && error.error?.mensaje) {
            alert(`Error: ${error.error.mensaje}`);
          }
        }
      );
    } else {
      alert('Debes llenar todos los campos y que sean correctos para la creación del rol');
      // Resalta visualmente los campos inválidos
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
