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
import { UbicacionesMonitoreoService } from 'src/app/service/ubicaciones-monitoreo.service';
import { PosicionService } from 'src/app/service/posicion.service';
import { DipositivoService } from 'src/app/service/dispositivo.service';



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
import { Subscription } from 'rxjs';
import { MomentModule } from 'ngx-moment';
import { Dispositivo } from 'src/app/model/dispositivo.model';
import { Estado } from 'src/app/model/estado.model';


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
  estados: any[] = [];
  dispositivos: any[] = [];
  mostrarEstado: boolean = true;
  selectedEstado: any | null = null;

  tab: string = 'estado';
  showTable: boolean = false;
  p: number = 1;

  constructor(
    private ubicacionesMonitoreoService: UbicacionesMonitoreoService,
    private webSocketService: WebSocketDispositivos,
    private service: EstadoService,
    private servicedispositivo: DipositivoService,
    private serviceposicion: PosicionService
  ) {}

  ngOnInit(): void {
    this.listarDispositivos();
    this.listarEstados();
    this.estadosSubscription = this.webSocketService.obtenerEstados()
      .subscribe((estados: any[]) => {
        // Ordenar estados por fecha de actualización (de más reciente a más antigua)
        estados.sort((a, b) => new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime());
        // Asignar estados ordenados a la variable this.estados
        this.estados = estados;
        this.calcularResumen();
  
        // Otro procesamiento que necesites hacer con los estados ordenados
        this.asignarPosicion(this.estados);
      });
    
  }
  

  ngOnDestroy(): void {
    if (this.estadosSubscription) {
      this.estadosSubscription.unsubscribe();
    }
  }

  listarEstados(): void {
    this.service.listar().subscribe(
      (estados: any[]) => {
        estados.sort((a, b) => new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime());
        const soloVinculados = estados.filter(est => est.dispositivo?.vinculado === true);
        this.estados = soloVinculados;
        this.calcularResumen();
        this.asignarPosicion(this.estados);
      },
      error => {
        console.error('Error al listar estados:', error);
      }
    );
  }
  listarDispositivos(): void {
    this.servicedispositivo.listar().subscribe(
      dispositivos => {
        const soloVinculados = dispositivos.filter(dis => dis?.vinculado === true);
        this.dispositivos = soloVinculados;
        this.calcularResumen();
      },
      error => {
        console.error('Error al listar dispositivos:', error);
      }
    );
  }

  ubicarDispositivo(dispositivo: any) {
    this.serviceposicion.buscarPorNumSerie(dispositivo.numSerie).subscribe(
      posicion => {
        if(posicion){
          dispositivo.posicion = posicion;
          this.ubicacionesMonitoreoService.fijarPunto(posicion.latitud, posicion.longitud);

        }
      },
      error => {
        console.error('Error al buscar dispositivo:', error);
      }
    );
  }

  asignarPosicion(estados: any) {
    for (const estado of estados) {
        this.serviceposicion.buscarPorNumSerie(estado.dispositivo.numSerie).subscribe(
            posicion => {
                if (posicion) {
                    estado.dispositivo.posicion = posicion;
                }
            },
            error => {
                console.error('Error al buscar dispositivo:', error);
            }
        );
    }
  }

  // Declaración de las variables
totales: number = 0;
tabletas: number = 0;
telefonos: number = 0;
conectados: number = 0;
desconectados: number = 0;
disponibles: number = 0;
noDisponibles: number = 0;


calcularResumen() {
  this.totales = this.dispositivos.length;
  this.tabletas = this.dispositivos.filter(dispositivo => dispositivo.categoria.nombre === 'Tableta').length;
  this.telefonos = this.dispositivos.filter(dispositivo => dispositivo.categoria.nombre === 'Teléfono').length;
  this.disponibles = this.dispositivos.filter(dispositivo => dispositivo.disponible).length;
  this.noDisponibles = this.dispositivos.filter(dispositivo => !dispositivo.disponible).length;

  this.conectados = this.estados.filter(estado => estado.conexionInternet).length;
  this.desconectados = this.estados.filter(estado => !estado.conexionInternet).length;
}



  hoverEffect(event: MouseEvent, estado: any) {
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