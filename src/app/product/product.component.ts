import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class productComponent implements OnInit{
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  sidebarShow: boolean = false;
  activeLink: string = '';
  
  ngOnInit(): void {

    this.dtoptions = {
      scrollY: 300,
      language: {
        searchPlaceholder: "Buscar Productos"
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
  isMenuOpen: boolean = false;

}
