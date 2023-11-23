import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

// Componente Angular para gestionar pagos
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  // Propiedad para almacenar datos de pagos
  paymentData: any;

  // Configuración para DataTables
  dtoptions: DataTables.Settings = {};

  // Observable para notificar cambios en datos a DataTables
  dtTrigger: Subject<any> = new Subject<any>();

  // Formulario reactivo para la creación de nuevos pagos
  newPaymentForm: FormGroup;

  // Elemento de DataTables obtenido mediante ViewChild
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  // Constructor del componente
  constructor(private dataService: DataService, private fb: FormBuilder) {
    // Inicializa el formulario reactivo con validaciones
    this.newPaymentForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
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

    // Inicializa DataTables y carga datos de pagos
    this.dtTrigger.next(null);
    this.loadPaymentData();
  }

  // Método ejecutado al destruir el componente
  ngOnDestroy(): void {
    // Cancela la suscripción a eventos de DataTables
    this.dtTrigger.unsubscribe();
  }

  // Carga los datos de pagos desde el servicio
  loadPaymentData() {
    this.dataService.getPaymentData().subscribe((data) => {
      if (data && data.payments && Array.isArray(data.payments)) {
        // Actualiza DataTables con nuevos datos
        if (this.dtElement) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Limpia la tabla antes de agregar nuevos datos
            dtInstance.clear();
  
            // Verifica y formatea los datos para DataTables
            const formattedData = data.payments.map((payment: any) => [
              payment && payment.id ? payment.id : '',
              payment && payment.user_name ? payment.user_name : '',
              payment && payment.total_payment ? payment.total_payment : '',
            ]);
  
            // Agrega los datos formateados y dibuja la tabla
            dtInstance.rows.add(formattedData);
            dtInstance.draw();
          });
        }
      } else {
        // Imprime en consola un mensaje de error si los datos no tienen el formato esperado
        console.error('Los datos de pagos, la propiedad "payments" o no es un array:', data);
      }
    });
  }

  // Método para crear un nuevo pago
  createPayment() {
    if (this.newPaymentForm.valid) {
      // Imprime en consola el inicio del proceso de creación
      console.log('Creando pago...', this.newPaymentForm.value);
      
      // Verificar la existencia de propiedades antes de acceder a ellas
      const paymentId = this.newPaymentForm.value.id ? this.newPaymentForm.value.id : '';
  
      // Llama al servicio para crear el pago
      this.dataService.createPaymentData({ id: paymentId }).subscribe(
        () => {
          // Imprime en consola el éxito en la creación
          console.log('Pago creado con éxito');
          
          // Reinicia el formulario y recarga los datos de pagos
          this.newPaymentForm.reset();
          this.loadPaymentData();
        },
        (error) => {
          // Imprime en consola en caso de error en la creación
          console.error('Error al crear el pago:', error);
        }
      );
    } else {
      // Alerta si el formulario no es válido y resalta visualmente los campos inválidos
      alert('Debes llenar todos los campos y que sean correctos para la creación del pago');
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
