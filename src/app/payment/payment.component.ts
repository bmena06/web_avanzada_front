import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

declare var $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  paymentData: any;
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  newPaymentForm: FormGroup;

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.newPaymentForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  ngOnInit(): void {
    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: 'Buscar Pagos',
      },
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 9,
    };

    // Inicializa DataTables en el evento ngOnInit
    this.dtTrigger.next(null);

    // Llama a la carga de datos después de inicializar DataTables
    this.loadPaymentData();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  loadPaymentData() {
    this.dataService.getPaymentData().subscribe((data) => {
      if (data && data.payments && Array.isArray(data.payments)) {
        if (this.dtElement) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.clear();
  
            const formattedData = data.payments.map((payment: any) => [
              payment && payment.id ? payment.id : '',
              payment && payment.user_name ? payment.user_name : '',
              payment && payment.total_payment ? payment.total_payment : '',
            ]);
  
            dtInstance.rows.add(formattedData);
            dtInstance.draw();
          });
        }
      } else {
        console.error('Los datos de pagos, la propiedad "payments" o no es un array:', data);
      }
    });
  }
  createPayment() {
    if (this.newPaymentForm.valid) {
      console.log('Creando pago...', this.newPaymentForm.value);
  
      // Verificar la existencia de propiedades antes de acceder a ellas
      const paymentId = this.newPaymentForm.value.id ? this.newPaymentForm.value.id : '';
  
      this.dataService.createPaymentData({ id: paymentId }).subscribe(
        () => {
          console.log('Pago creado con éxito');
          this.newPaymentForm.reset();
          // Mover la carga de datos aquí para garantizar que se actualice después de la creación exitosa
          this.loadPaymentData();
        },
        (error) => {
          console.error('Error al crear el pago:', error);
        }
      );
    } else {
      alert('Debes llenar todos los campos y que sean correctos para la creación del pago');
      // Resalta visualmente los campos inválidos
      Object.keys(this.newPaymentForm.controls).forEach((key) => {
        const control = this.newPaymentForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
          control?.setErrors({ invalid: true });
        }
      });
    }
  }
}
