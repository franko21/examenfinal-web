import {DatePipe, NgFor, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {Component, TemplateRef, ViewChild} from '@angular/core';
import { AlertaService } from 'src/app/service/alerta.service';
import { DipositivoService } from 'src/app/service/dispositivo.service';
import { Alerta } from 'src/app/model/alerta.model';
import { Subscription } from 'rxjs';
import { WebSocketDispositivos } from 'src/app/service/WebSocketDispositivos.service';
import { Dispositivo } from 'src/app/model/dispositivo.model';
import {FormsModule} from "@angular/forms";
import {IconDirective} from "@coreui/icons-angular";
import {NgxPaginationModule} from "ngx-pagination";
import {ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent} from "@coreui/angular";


@Component({
  selector: 'app-alerta',
  standalone: true,
  imports: [NgFor, NgIf, HttpClientModule, FormsModule, IconDirective, NgxPaginationModule, ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent],
  providers:[AlertaService,DatePipe,DipositivoService,WebSocketDispositivos],
  templateUrl: './alerta.component.html',
  styleUrl: './alerta.component.scss'
})
export class AlertaComponent {
  private dispositivosSuscripcion: Subscription;
  dispositivos: Dispositivo [] = [];

  filaEditada: number | null = null;
  alertas:Alerta[]=[];
  alerts:Alerta=new Alerta();
  alertSeleccionado: any = null;
  searchText: string = '';
  alerta: any;
  p: number = 1; // Página actual para la paginación
  isModalVisible = false;




  constructor(
    private alertaService:AlertaService,
    private webSocket: WebSocketDispositivos,
    private datePipe:DatePipe,
    private dispositivoService:DipositivoService

  ){

  }
  ngOnInit(){
    this.alertaService.getAlertas().subscribe(
      aler=>{
        this.alertas=aler;
      }
    )
    this.dispositivoService.listar().subscribe(
      dis=>{
        this.dispositivos=dis;
      }
    )

  }

  filteredAlertas() {
    if (!this.searchText) {
      return this.alertas;
    }

    return this.alertas.filter(alerta => {
      return (
        alerta.descripcion?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        alerta.dispositivo?.nombre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        alerta.dispositivo?.modelo?.nombre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        alerta.dispositivo?.modelo?.marca?.nombre?.toLowerCase().includes(this.searchText.toLowerCase())||
        alerta.dispositivo?.categoria?.nombre?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }
  formatDate2(date: Date, format: string): string {
    return <string>this.datePipe.transform(date, format);
  }
  mostrarDetalles(alert: any): void {
    this.alertSeleccionado = alert;
    this.isModalVisible = true;

  }

  cerrarDetalles(): void {
    this.alertSeleccionado = null;
    this.isModalVisible = false;
  }
}
