import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class productComponent implements OnInit {
  productData: any;
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  newProductForm: FormGroup;
  selectedProductId: number | null = null;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.newProductForm = this.fb.group({
      id: [0, Validators.required],
      name: ['', Validators.required],
      price: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: 'Buscar Productos',
      },
      pagingType: 'full_numbers',
      columnDefs: [
        {
          targets: -1,
        },
        {
          className: 'dt-body',
          targets: '_all',
        },
      ],
    };

    this.loadProductData();
  }

  loadProductData() {
    this.dataService.getProductData().subscribe((data) => {
      this.productData = data.productos;
    });
  }

  createProduct() {
    console.log('Creando producto...', this.newProductForm.value);
    this.dataService.createProduct(this.newProductForm.value).subscribe(
      () => {
        console.log('Producto creado con éxito');
        this.loadProductData();
        this.newProductForm.reset();
      },
      (error) => {
        console.error('Error al crear el producto:', error);
        // Puedes mostrar un mensaje de error al usuario si lo deseas
      }
    );
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
