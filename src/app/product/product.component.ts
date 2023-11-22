import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class productComponent implements OnInit, OnDestroy {
  productData: any;
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  newProductForm: FormGroup;
  selectedProductId: number | null = null;

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.newProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      price: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  loadProductData() {
    this.dataService.getProductData().subscribe((data) => {
      // Actualiza DataTables con nuevos datos
      if (this.dtElement) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Limpia la tabla antes de agregar nuevos datos
          dtInstance.clear();
          
          // Verifica que los datos estén en el formato esperado por DataTables
          const formattedData = data.productos.map((product: { id: any; name: any; price: any; }) => [product.id, product.name, product.price]);
  
          dtInstance.rows.add(formattedData);
          dtInstance.draw();
        });
      }
    });
  }

  createProduct() {
    if (this.newProductForm.valid) {
      console.log('Creando producto...', this.newProductForm.value);
      this.dataService.createProduct(this.newProductForm.value).subscribe(
        () => {
          console.log('Producto creado con éxito');
          this.newProductForm.reset();
          // Mover la carga de datos aquí para garantizar que se actualice después de la creación exitosa
          this.loadProductData();
        },
        (error) => {
          console.error('Error al crear el producto:', error);
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

  selectProductForUpdateDelete(id: number) {
    this.selectedProductId = id;
  }

  updateProduct() {
    if (this.selectedProductId !== null) {
      this.dataService
        .updateProduct(this.selectedProductId, this.newProductForm.value)
        .subscribe(() => {
          this.loadProductData();
          this.selectedProductId = null;
          this.newProductForm.reset();
        });
    }
  }

  deleteProduct() {
    if (this.selectedProductId !== null) {
      this.dataService.deleteProduct(this.selectedProductId).subscribe(() => {
        this.loadProductData();
        this.selectedProductId = null;
      });
    }
  }
}
