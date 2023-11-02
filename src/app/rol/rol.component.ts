import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss'],
})
export class RolComponent implements OnInit{
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  ngOnInit(): void {

    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: "Buscar rol"
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
