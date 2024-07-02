import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertaService } from 'src/app/service/alerta.service';
import { Alerta } from 'src/app/model/alerta.model';
import { Subscription } from 'rxjs';
import { WebSocketDispositivos } from 'src/app/service/WebSocketDispositivos.service';
import { Dispositivo } from 'src/app/model/dispositivo.model';

@Component({
  selector: 'app-alerta',
  standalone: true,
  imports: [NgFor,NgIf,HttpClientModule],
  providers:[AlertaService],
  templateUrl: './alerta.component.html',
  styleUrl: './alerta.component.scss'
})
export class AlertaComponent {
  private dispositivosSuscripcion: Subscription;
  dispisitivos: Dispositivo [] = [];

  filaEditada: number | null = null;
  alertas:Alerta[]=[];
  alerts:Alerta=new Alerta();
  alertSeleccionado: any = null;
  constructor(
    private alertaService:AlertaService,
    private webSocket: WebSocketDispositivos
  ){

  }
  ngOnInit(){
    this.alertaService.getAlertas().subscribe(
      aler=>{
        this.alertas=aler;
      }
    )
    //para recibir dispositivos actualiazdos y obtener sus alertas
    this.dispositivosSuscripcion = this.webSocket.obtenerDispositivos().subscribe(
      (dispositivos: any[]) => {
        if(dispositivos.length > 0){
          this.dispisitivos = dispositivos;
          this.alertas = [];
          for(dispositivo: this.dispositivos){
            this.alertas.push(dispositivo);
          }
        }
        this.posiciones = dispositivos;
        // Agregar marcadores de posiciones
        this.posiciones.forEach((pos, index) => {
          const marker = new google.maps.Marker({
            position: { lat: pos.latitud, lng: pos.longitud },
            icon: {
              url: ruta,
                scaledSize: new google.maps.Size(30, 30),  // Escala del ícono
              },
            map: this.map.googleMap
          });
        });
      },
      error => {
        console.error('Error al suscribirse a las posiciones:', error);
      }
    );


    console.log(this.alertas.at(0)?.descripcion);
  }
  mostrarDetalles(alert: any): void {
    this.alertSeleccionado = alert;
    console.log(alert.prestamo.dispositivo.nombre); // Esto debería imprimir el nombre del dispositivo
  }

  cerrarDetalles(): void {
    this.alertSeleccionado = null;
  }
}
