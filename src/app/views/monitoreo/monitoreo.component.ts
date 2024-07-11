import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { UbicacionesComponent } from '../mapas/ubicaciones/ubicaciones.component';
import { ZonasSegurasComponent } from '../mapas/zonas-seguras/zonas-seguras.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { WebSocketDispositivos } from 'src/app/service/WebSocketDispositivos.service';
import { EstadoService } from 'src/app/service/estado.service';

import {
  RowComponent,
  ColComponent,
  WidgetStatAComponent,
  ThemeDirective,
  DropdownComponent,
  ButtonDirective,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  DropdownDividerDirective,
  AccordionButtonDirective,
  AccordionComponent,
  AccordionItemComponent,
  TemplateIdDirective,
  TableDirective,
  ProgressBarDirective,
  ProgressComponent,
  PopoverModule,
  


} from '@coreui/angular';
import { Dispositivo } from 'src/app/model/dispositivo.model';
import { DipositivoService } from 'src/app/service/dispositivo.service';
import { Subscription } from 'rxjs';
import { MomentModule } from 'ngx-moment';


@Component({
  selector: 'app-monitoreo',
  standalone: true,
  // Importaciones de módulos y componentes (no deben estar aquí, sino en NgModule)
  imports: [
    MomentModule,
    PopoverModule,
    WidgetsDropdownComponent,
    IconDirective,
    ChartjsComponent,
    CommonModule,
    ZonasSegurasComponent,
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
    DropdownDividerDirective,
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    UbicacionesComponent,
    NgxPaginationModule,
    TableDirective,
    ProgressBarDirective,
    ProgressComponent

  ],
  providers: [DipositivoService],
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss']
})
export class MonitoreoComponent implements OnInit, OnDestroy {
  estadosSubscription: Subscription;
  estados: any[] = []; // Asegúrate de tener una estructura adecuada para estados
  mostrarEstado: boolean = true;
  selectedEstado: any | null = null;

  tab: string = 'estado';
  showTable: boolean = false;
  p: number = 1;

  constructor(
    private webSocketService: WebSocketDispositivos,
    private service: EstadoService
  ) {}

  ngOnInit(): void {
    this.listarEstados(); // Cargar estados al inicio
    this.estadosSubscription = this.webSocketService.obtenerEstados()
      .subscribe((estados: any[]) => {
        this.estados = estados;    
      });
  }

  ngOnDestroy(): void {
    if (this.estadosSubscription) {
      this.estadosSubscription.unsubscribe();
    }
  }

  listarEstados(): void {
    this.service.listar().subscribe(
      estados => {
        this.estados = estados;
      },
      error => {
        console.error('Error al listar estados:', error);
      }
    );
  }

  ubicarDispositivo(dispositivo: any) {
    // Lógica para ubicar el dispositivo
    console.log('Ubicando dispositivo:', dispositivo);
  }

  hoverEffect(event: MouseEvent, estado: any) {
    // Cambios de estilo adicionales o lógica según el evento (hover, mouseleave)
    if (event.type === 'mouseenter') {
      this.selectedEstado = estado;
    } else {
      this.selectedEstado = null;
    }
  }

  getNumPermisos(estado: any): number {
    let count = 0;
    if (estado.localizacion) count++;
    if (estado.gps) count++;
    if (estado.phoneState) count++;
    if (estado.notificaciones) count++;
    return count;
  }
}