import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

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

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective | any;

  constructor(private dataService: DataService) {}

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
  
  

}
