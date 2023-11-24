import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  paymentData: any[] = [];
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  newPaymentForm: FormGroup;

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.newPaymentForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  ngAfterViewInit(): void {
    // Verifica si el elemento DataTables está disponible
    if (this.dtElement && this.dtElement.dtInstance) {
      const dtInstance: DataTables.Api = this.dtElement.dtInstance;

      // Dispara el evento para reconfigurar DataTables
      this.dtTrigger.next(null);
    }
  }

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
    };

    // Carga datos de pagos
    this.loadPaymentData();
  }

  ngOnDestroy(): void {
    // Cancela la suscripción a eventos de DataTables
    this.dtTrigger.unsubscribe();
  }

  loadPaymentData() {
    this.dataService.getPaymentData().subscribe((data) => {
      if (data && data.payments && Array.isArray(data.payments)) {
        this.paymentData = data.payments.map((payment: any) => ({
          id: payment.id || '',
          usuario: payment.user_name || '',
          total: payment.total_payment || '',
        }));

        // Dispara el evento para reconfigurar DataTables
        this.dtTrigger.next(null);
      } else {
        console.error('Los datos de pagos, la propiedad "payments" o no es un array:', data);
      }
    });
  }

  generatePdf() {
    if (this.paymentData && this.paymentData.length > 0) {
      const pdfDoc = new jsPDF();
      pdfDoc.setTextColor(0, 51, 161);

      pdfDoc.text('Pagos JBM', pdfDoc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

      const columns = ['ID', 'Usuario', 'Total a pagar'];

      autoTable(pdfDoc, {
        head: [columns],
        body: this.paymentData.map(payment => [payment.id, payment.usuario, payment.total]),
      });

      pdfDoc.save('pagos.pdf');
    } else {
      alert('No hay datos de pagos disponibles.');
    }
  }
}
