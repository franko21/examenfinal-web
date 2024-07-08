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
  


} from '@coreui/angular';
import { Dispositivo } from 'src/app/model/dispositivo.model';
import { DipositivoService } from 'src/app/service/dispositivo.service';
import { Subscription } from 'rxjs';
import { Estado } from 'src/app/model/estado.model';

@Component({
  selector: 'app-monitoreo',
  standalone: true,
  // Importaciones de módulos y componentes (no deben estar aquí, sino en NgModule)
  imports: [
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
    ProgressComponent,

  ],
  providers: [DipositivoService],
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss']
})
export class MonitoreoComponent implements OnInit, OnDestroy {
  estadosSubscription: Subscription;
  estados: Estado[] = [];
  mostrarEstado: boolean = true; // Variable para controlar qué sección mostrar

  tab: string = 'estado';
  toggleTab(tabName: string): void {
    this.tab = tabName;
  }

  showTable: boolean = false;
  public dispositivo: Dispositivo = new Dispositivo();
  dispositivos: Dispositivo[] = [];
  selectedEstado: Estado | null = null;
  p: number = 1;
  constructor(
    private webSocketService: WebSocketDispositivos,
    private el: ElementRef,
    private service: EstadoService) { }

  listarEstados() {
    this.service.listar().subscribe(
      estados => {
        this.estados = estados;
      },
      error => {
        console.error('Error al listar estados:', error);
      }
    );
  }

  ngOnInit(): void {
    this.listarEstados();
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

  // Método para alternar la vista de la tabla
  toggleView() {
    this.showTable = !this.showTable;
  }

  seleccionarDispositivo(estado: Estado): void {
    this.selectedEstado = estado;
        this.mostrarEstado = !this.mostrarEstado; // Alternar el valor de mostrarEstado

  }
}
