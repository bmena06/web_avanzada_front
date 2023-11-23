import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Componente Angular para gestionar producciones
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  // Lista de producciones
  productions: any[] = [];

  // Configuración para DataTables
  dtoptions: DataTables.Settings = {};

  // Observable para notificar cambios en datos a DataTables
  dtTrigger: Subject<any> = new Subject<any>;

  // Formulario reactivo para la creación de nuevas producciones
  newProductionForm: FormGroup;

  // Elemento de DataTables obtenido mediante ViewChild
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  // Constructor del componente
  constructor(private dataService: DataService, private fb: FormBuilder) {
    // Inicializa el formulario reactivo con validaciones
    this.newProductionForm = this.fb.group({
      product_id: ['', [Validators.required]],
    });
  }

  // Método ejecutado al inicializar el componente
  ngOnInit(): void {
    // Configuración de DataTables
    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: 'Buscar Producciones',
      },
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 9,
    };

    // Inicializa DataTables en el evento ngOnInit
    this.dtTrigger.next(null);
  }

  // Método ejecutado después de inicializar la vista
  ngAfterViewInit(): void {
    this.loadProductions();
  }

  // Método ejecutado al destruir el componente
  ngOnDestroy(): void {
    // Cancela la suscripción a eventos de DataTables
    this.dtTrigger.unsubscribe();
  }

  // Carga los datos de producciones desde el servicio
  loadProductions() {
    this.dataService.getProductions().subscribe(data => {
      // Actualiza DataTables con nuevos datos
      if (this.dtElement) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Limpia la tabla antes de agregar nuevos datos
          dtInstance.clear();
  
          // Verifica y formatea los datos para DataTables
          const formattedData = data.producciones.map((production: { id: any; package_id: any; date: any; product_name: any; user_name: any }) => [production.id, production.package_id, production.date, production.product_name, production.user_name]);
  
          // Agrega los datos formateados y dibuja la tabla
          dtInstance.rows.add(formattedData);
          dtInstance.draw();
        });
      }
    });
  }
  
  // Método para crear una nueva producción
  createProduction() {
    const user_id = localStorage.getItem('user_id');
    console.log("ID:", user_id);
    if (user_id && this.newProductionForm) {
      // Construye el objeto de datos de producción
      const productionData = {
        product_id: this.newProductionForm.value.product_id,
        user_id: user_id,
      };
  
      // Imprime en consola el inicio del proceso de creación
      console.log('Creando producción...', productionData);
  
      // Llama al servicio para crear la producción
      this.dataService.createProduction(productionData).subscribe(
        () => {
          // Imprime en consola el éxito en la creación
          console.log('Producción creada con éxito');
          
          // Reinicia el formulario y recarga los datos de producciones
          this.newProductionForm.reset();
          this.loadProductions();
        },
        (error) => {
          // Imprime en consola en caso de error en la creación
          console.error('Error al crear la producción:', error);
  
          // Verificar si el error es por producto inexistente
          if (error.status === 404 && error.error && error.error.mensaje) {
            alert(error.error.mensaje);
          } else {
            alert('Error al crear la producción');
          }
        }
      );
    } else {
      // Alerta si el formulario no es válido y resalta visualmente los campos inválidos
      alert('Debes llenar todos los campos y que sean correctos para la creación de la producción');
      Object.keys(this.newProductionForm.controls).forEach(key => {
        const control = this.newProductionForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
          control?.setErrors({ 'invalid': true });
        }
      });
    }
  }
}
