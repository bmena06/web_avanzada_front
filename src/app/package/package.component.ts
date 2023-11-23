import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

// Componente Angular para gestionar paquetes
@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss'],
})
export class PackageComponent implements OnInit, OnDestroy {
  // Propiedad para almacenar datos de paquetes
  packageData: any[] = [];

  // Configuración para DataTables
  dtoptions: DataTables.Settings = {};

  // Observable para notificar cambios en datos a DataTables
  dtTrigger: Subject<any> = new Subject<any>();

  // Formulario reactivo para la creación de nuevos paquetes
  newPackageForm: FormGroup;

  // Identificador del paquete seleccionado (si hay alguno)
  selectedPackageId: number | null = null;

  // Elemento de DataTables obtenido mediante ViewChild
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  // Constructor del componente
  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    // Inicializa el formulario reactivo con validaciones
    this.newPackageForm = this.fb.group({
      date: [null, Validators.required],
      active: [null, Validators.required],
      amount: [null, Validators.required],
      user_name: [null, Validators.required]
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

    // Inicializa DataTables y carga datos de paquetes
    this.dtTrigger.next(null);
    this.loadPackageData();
  }

  // Método ejecutado al destruir el componente
  ngOnDestroy(): void {
    // Cancela la suscripción a eventos de DataTables
    this.dtTrigger.unsubscribe();
  }

  // Carga los datos de paquetes desde el servicio
  loadPackageData() {
    this.dataService.getPackageData().subscribe((data) => {
      // Actualiza DataTables con nuevos datos
      if (this.dtElement) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Limpia la tabla antes de agregar nuevos datos
          dtInstance.clear();
          
          // Verifica y formatea los datos para DataTables
          const formattedData = data.packages.map((pkg: { id: any; date: any; active: any; amount: any; user_name: any}) => [pkg.id, pkg.date, pkg.active, pkg.amount, pkg.user_name]);
  
          // Agrega los datos formateados y dibuja la tabla
          dtInstance.rows.add(formattedData);
          dtInstance.draw();
        });
      }
    });
  }

  // Método para crear un nuevo paquete
  createPackage() {
    if (this.newPackageForm.valid) {
      // Imprime en consola el inicio del proceso de creación
      console.log('Creando paquete...', this.newPackageForm.value);
      
      // Llama al servicio para crear el paquete
      this.dataService.createPackage(this.newPackageForm.value).subscribe(
        () => {
          // Imprime en consola el éxito en la creación
          console.log('Paquete creado con éxito');
          
          // Reinicia el formulario y recarga los datos de paquetes
          this.newPackageForm.reset();
          this.loadPackageData();
        },
        (error) => {
          // Imprime en consola en caso de error en la creación
          console.error('Error al crear el paquete:', error);
        }
      );
    } else {
      // Alerta si el formulario no es válido y resalta visualmente los campos inválidos
      alert('Debes llenar todos los campos y que sean correctos para la creación del paquete');
      Object.keys(this.newPackageForm.controls).forEach(key => {
        const control = this.newPackageForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
          control?.setErrors({ 'invalid': true });
        }
      });
    }
  }

  // Método para seleccionar un paquete para actualizar o eliminar
  selectPackageForUpdateDelete(id: number) {
    this.selectedPackageId = id;
  }
}
