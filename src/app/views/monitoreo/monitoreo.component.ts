import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { MapaComponent } from '../mapa/mapa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import {
  RowComponent,
  ColComponent,
  WidgetStatAComponent,
  TemplateIdDirective,
  ThemeDirective,
  DropdownComponent,
  ButtonDirective,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  DropdownDividerDirective
} from '@coreui/angular';
import { Dispositivo } from 'src/app/model/dispositivo.model';
import { DipositivoService } from 'src/app/service/dispositivo.service';

@Component({
  selector: 'app-monitoreo',
  standalone: true,
  // Importaciones de módulos y componentes (no deben estar aquí, sino en NgModule)
  imports: [
    WidgetsDropdownComponent,
    IconDirective,
    ChartjsComponent,
    CommonModule,
    RouterLink,
    MapaComponent,
    FormsModule,
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    WidgetStatAComponent,
    TemplateIdDirective,
    ThemeDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    DropdownDividerDirective
  ],
  providers:[DipositivoService],
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss']
})
export class MonitoreoComponent implements OnInit {
  showTable: boolean = false;
  public dispositivo:Dispositivo=new Dispositivo();
  dispositivos: Dispositivo[] = [];
  title = 'my-carousel-project';
  cards = [
    { title: 'Card 1', text: 'This is card 1.' },
    { title: 'Card 2', text: 'This is card 2.' },
    { title: 'Card 3', text: 'This is card 3.' },
    { title: 'Card 4', text: 'This is card 4.' },
    { title: 'Card 1', text: 'This is card 1.' },
    { title: 'Card 2', text: 'This is card 2.' },
    { title: 'Card 3', text: 'This is card 3.' },
    { title: 'Card 4', text: 'This is card 4.' },
    { title: 'Card 5', text: 'This is card 5.' }
  ];

  constructor(private el: ElementRef,private serdispo:DipositivoService) {}

  listardispo() {
    this.serdispo.listar().subscribe(
      dispositivos => {
        this.dispositivos = dispositivos; 
        console.log(this.dispositivos);  
      },
      error => {
        console.error('Error al listar dispositivos:', error);
      }
    );
  }

  ngOnInit(): void {
    this.listardispo();  
  }

  // Método para alternar la vista de la tabla
  toggleView() {
    this.showTable = !this.showTable;
  }

  // Listener para el evento de scroll en el carousel
  @HostListener('wheel', ['$event'])
  onWheelScroll(event: WheelEvent) {
    const container = this.el.nativeElement.querySelector('.carousel-container');
    if (!container.contains(event.target as Node)) {
      return;
    }
  
    event.preventDefault();
    event.stopPropagation();
  
    const scrollLeft = container.scrollLeft;
    const scrollFactor = 1.5;
    const scrollAmount = event.deltaY * scrollFactor;
  
    container.scrollTo({
      left: scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  }

  // Método para mostrar mensaje en la consola al hacer clic en el botón del dropdown
  mensaje(): void {
    console.log("Se está dando click al botón del dropdown.");
  }
}
