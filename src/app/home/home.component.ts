import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  productions: any[] = [];
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>;
  newProductionForm: FormGroup;

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.newProductionForm = this.fb.group({
      product_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    this.loadProductions();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  loadProductions() {
    this.dataService.getProductions().subscribe(data => {
      // Actualiza DataTables con nuevos datos
      if (this.dtElement) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Limpia la tabla antes de agregar nuevos datos
          dtInstance.clear();
  
          // Verifica que los datos estén en el formato esperado por DataTables
          const formattedData = data.producciones.map((production: { id: any; package_id: any; date: any; product_name: any; user_name: any }) => [production.id, production.package_id, production.date, production.product_name, production.user_name]);
  
          dtInstance.rows.add(formattedData);
          dtInstance.draw();
        });
      }
    });
  }
  
  createProduction() {
    const user_id = localStorage.getItem('user_id');
    console.log("ID:", user_id);
    if (user_id && this.newProductionForm) {
      const productionData = {
        product_id: this.newProductionForm.value.product_id,
        user_id: user_id,
      };
  
      console.log('Creando producción...', productionData);
  
      this.dataService.createProduction(productionData).subscribe(
        () => {
          console.log('Producción creada con éxito');
          this.newProductionForm.reset();
          this.loadProductions();
        },
        (error) => {
          console.error('Error al crear la producción:', error);
        }
      );
    } else {
      alert('Debes llenar todos los campos y que sean correctos para la creación de la producción');
      // Resalta visualmente los campos inválidos
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
