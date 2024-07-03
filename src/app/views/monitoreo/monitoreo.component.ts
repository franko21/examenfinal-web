import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import {UbicacionesComponent} from '../mapas/ubicaciones/ubicaciones.component';
import {ZonasSegurasComponent} from '../mapas/zonas-seguras/zonas-seguras.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { WebSocketDispositivos } from 'src/app/service/WebSocketDispositivos.service';
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
  providers:[DipositivoService],
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss']
})
export class MonitoreoComponent {
  showTable: boolean = false;
  public dispositivo:Dispositivo=new Dispositivo();
  dispositivos: Dispositivo[] = [];
  selectedDispositivo: Dispositivo | null = null;
  p: number = 1;
  private dispositivosSuscripcion: Subscription;
  constructor(private el: ElementRef,private serdispo:DipositivoService, private webSocket: WebSocketDispositivos) {}

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

  
  listardispo2(){
    this.dispositivosSuscripcion = this.webSocket.obtenerDispositivos().subscribe(
      (dispositivos: any[]) => {
        if (dispositivos) {
          this.dispositivos = dispositivos;
        }
      },
      error => {
        console.error('Error al suscribirse a los dispositivos:', error);
      }
    );
  }

  ngOnInit(): void {
    this.listardispo();
    this.listardispo2();  
  }


  // Método para alternar la vista de la tabla
  toggleView() {
    this.showTable = !this.showTable;
  }
  seleccionarDispositivo(dispositivo: Dispositivo): void {
    this.selectedDispositivo = dispositivo;
    console.log('Dispositivo seleccionado:', this.selectedDispositivo);
  }
}
