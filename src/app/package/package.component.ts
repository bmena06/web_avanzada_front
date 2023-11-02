import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';


declare var $: any;

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss'],
})
export class PackageComponent implements OnInit{
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  ngOnInit(): void {

    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: "Buscar paquete"
      },
      pagingType: 'full_numbers',
      columnDefs: [
        {
          targets: -1, // Índice de la última columna
        },
        {
          className: 'dt-body', targets:"_all" // Clase CSS a aplicar
        }
      ],
    }
  }
}

