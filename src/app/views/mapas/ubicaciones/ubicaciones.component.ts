import { Component, NgZone, OnDestroy, ViewChild } from '@angular/core';
import {GoogleMap, MapHeatmapLayer, MapMarker} from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WebSocketPosicion } from 'src/app/service/WebSocketPosicion.service';
import { PosicionService } from 'src/app/service/posicion.service';
import { Subscription } from 'rxjs';
import { Posicion } from 'src/app/model/posicion.model';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [
    GoogleMap, MapHeatmapLayer, CommonModule, MapMarker,HttpClientModule,
  ],
  templateUrl: './ubicaciones.component.html',
  styleUrl: './ubicaciones.component.scss'
})
export class UbicacionesComponent implements OnDestroy{

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  center: google.maps.LatLngLiteral = { lat: -2.879767894744873, lng: -78.97490692138672 };
  zoom = 12;
  private posicionSubscription: Subscription;
  posiciones: Posicion[] = [];

  constructor(
    private webSocketPosicion: WebSocketPosicion,
    private posicionService: PosicionService,
    private zone: NgZone
  ) {}

  ngOnDestroy(): void {
    if (this.posicionSubscription) {
      this.posicionSubscription.unsubscribe();
    }
  }

  loadOtherPositionsMarkers() {
    // Obtener posiciones de otros dispositivos y agregar marcadores en el mapa
    this.listarposiciones();
    console.log(this.posiciones.length);
    const ruta = 'https://th.bing.com/th/id/R.e6d5549d7d43ef8e34af49fed37e1196?rik=nb2KWBpNv895Bw&pid=ImgRaw&r=0';
    //suscribirse al WebSocket para recibir actualización posiciones en tiempo real:
    this.posicionSubscription = this.webSocketPosicion.obtenerPosiciones().subscribe(
      (posiciones: any[]) => {
        this.posiciones = posiciones;
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
  }

  listarposiciones() {
    this.posicionService.listar().subscribe(
      (posiciones: Posicion[]) => {
        this.posiciones = posiciones;
        console.log(this.posiciones.length);
      },
      error => {
        console.error('Error al listar posiciones:', error);
      }
    );
  }

  
}