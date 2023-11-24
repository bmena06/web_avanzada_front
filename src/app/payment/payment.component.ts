import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { jsPDF } from 'jspdf';


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
  searchTerm: any;

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
  generatePdf() {
    // Verificar si paymentData está definido
    if (this.paymentData && this.paymentData.length > 0) {
      // Obtener el pago seleccionado según el término de búsqueda
      const selectedPayment = this.paymentData.find((payment: any) =>
        payment.usuario.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  
      if (selectedPayment) {
        // Crear un nuevo documento PDF
        const pdfDoc = new jsPDF();
  
        // Añadir contenido al PDF (puedes personalizar esto según tus necesidades)
        pdfDoc.text(`ID: ${selectedPayment.id}`, 10, 10);
        pdfDoc.text(`Usuario: ${selectedPayment.user_name}`, 10, 20);
        pdfDoc.text(`Total a pagar: ${selectedPayment.total_payment}`, 10, 30);
  
        // Guardar el PDF con un nombre específico o simplemente abrirlo en una nueva ventana
        // Puedes ajustar esto según tus necesidades
        pdfDoc.save(`pago_${selectedPayment.id}.pdf`);
      } else {
        // Manejar el caso donde no se ha encontrado el pago
        alert('No se encontró ningún pago con el usuario proporcionado.');
      }
    } else {
      // Manejar el caso donde paymentData no está definido o está vacío
      alert('No hay datos de pagos disponibles.');
    }
  }
}
