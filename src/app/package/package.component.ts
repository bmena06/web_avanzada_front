import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

declare var $: any;

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss'],
})
export class PackageComponent implements OnInit, OnDestroy {
  packageData: any[] = [];
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  newPackageForm: FormGroup;
  selectedPackageId: number | null = null;

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.newPackageForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      date: [null, Validators.required],
      active: [null, Validators.required],
      amount: [null, Validators.required],
      user_name: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: 'Buscar Paquetes',
      },
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 9,
    };

    // Inicializa DataTables en el evento ngOnInit
    this.dtTrigger.next(null);

    // Llama a la carga de datos después de inicializar DataTables
    this.loadPackageData();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  loadPackageData() {
    this.dataService.getPackageData().subscribe((data) => {
      // Actualiza DataTables con nuevos datos
      if (this.dtElement) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Limpia la tabla antes de agregar nuevos datos
          dtInstance.clear();
          
          // Verifica que los datos estén en el formato esperado por DataTables
          const formattedData = data.packages.map((pkg: { id: any; date: any; active: any; amount: any; user_name: any}) => [pkg.id, pkg.date, pkg.active, pkg.amount, pkg.user_name]);
  
          dtInstance.rows.add(formattedData);
          dtInstance.draw();
        });
      }
    });
  }


  createPackage() {
    if (this.newPackageForm.valid) {
      console.log('Creando paquete...', this.newPackageForm.value);
      this.dataService.createPackage(this.newPackageForm.value).subscribe(
        () => {
          console.log('Paquete creado con éxito');
          this.newPackageForm.reset();
          // Mover la carga de datos aquí para garantizar que se actualice después de la creación exitosa
          this.loadPackageData();
        },
        (error) => {
          console.error('Error al crear el paquete:', error);
        }
      );
    } else {
      alert('Debes llenar todos los campos y que sean correctos para la creación del paquete');
      // Resalta visualmente los campos inválidos
      Object.keys(this.newPackageForm.controls).forEach(key => {
        const control = this.newPackageForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
          control?.setErrors({ 'invalid': true });
        }
      });
    }
  }

  selectPackageForUpdateDelete(id: number) {
    this.selectedPackageId = id;
  }

  updatePackage() {
    if (this.selectedPackageId !== null) {
      this.dataService
        .updatePackage(this.selectedPackageId, this.newPackageForm.value)
        .subscribe(() => {
          this.loadPackageData();
          this.selectedPackageId = null;
          this.newPackageForm.reset();
        });
    }
  }

  deletePackage() {
    if (this.selectedPackageId !== null) {
      this.dataService.deletePackage(this.selectedPackageId).subscribe(() => {
        this.loadPackageData();
        this.selectedPackageId = null;
      });
    }
  }
}
