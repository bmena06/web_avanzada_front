import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

// Componente Angular para gestionar productos
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class productComponent implements OnInit, OnDestroy {
    // Propiedad para almacenar datos de productos
  productData: any;
    // Configuración para DataTables
  dtoptions: DataTables.Settings = {};
    // Observable para notificar cambios en datos a DataTables
  dtTrigger: Subject<any> = new Subject<any>();
    // Formulario reactivo para la creación de nuevos productos
  newProductForm: FormGroup;
    // Identificador del producto seleccionado (si hay alguno)
  selectedProductId: number | null = null;

  // Elemento de DataTables obtenido mediante ViewChild
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;


    // Constructor del componente
  constructor(
    private dataService: DataService,
    private fb: FormBuilder
        // Inicializa el formulario reactivo con validaciones
  ) {
    this.newProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      price: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  ngOnInit(): void {
    // Configuración de DataTables
    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: 'Buscar Productos',
      },
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 10,
    };

    // Inicializa DataTables en el evento ngOnInit
    this.dtTrigger.next(null);

    // Llama a la carga de datos después de inicializar DataTables
    this.loadProductData();
  }

  // Método ejecutado al destruir el componente
  ngOnDestroy(): void {
    // Cancela la suscripción a eventos de DataTables
    this.dtTrigger.unsubscribe();
  }

    // Carga los datos de productos desde el servicio
  loadProductData() {
    this.dataService.getProductData().subscribe((data) => {
      // Actualiza DataTables con nuevos datos
      if (this.dtElement) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Limpia la tabla antes de agregar nuevos datos
          dtInstance.clear();
          
          // Verifica que los datos estén en el formato esperado por DataTables
          const formattedData = data.productos.map((product: { id: any; name: any; price: any; }) => [product.id, product.name, product.price]);
            // Agrega los datos formateados y dibuja la tabla
          dtInstance.rows.add(formattedData);
          dtInstance.draw();
        });
      }
    });
  }
  // Método para crear un nuevo producto
  createProduct() {
    if (this.newProductForm.valid) {
      console.log('Creando producto...', this.newProductForm.value);
            // Llama al la clase para crear el producto
      this.dataService.createProduct(this.newProductForm.value).subscribe(
        () => {
          console.log('Producto creado con éxito');
          // Reinicia el formulario 
          this.newProductForm.reset();
          //  carga de datos después de la creación exitosa
          this.loadProductData();
        },
        (error) => {
          console.error('Error al crear el producto:', error);

                    // Muestra una alerta en caso de un error específico
          if (error.status === 400 && error.error?.mensaje) {
            alert(`Error: ${error.error.mensaje}`);
          }
        }
      );
    } else {
      alert('Debes llenar todos los campos y que sean correctos para la creación del producto');
      // Resalta visualmente los campos inválidos
      Object.keys(this.newProductForm.controls).forEach(key => {
        const control = this.newProductForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
          control?.setErrors({ 'invalid': true });
        }
      });
    }
  }
}
