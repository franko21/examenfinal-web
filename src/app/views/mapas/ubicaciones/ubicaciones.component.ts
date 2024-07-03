import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {GoogleMap, MapHeatmapLayer, MapMarker} from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import{WebSocketDispositivos} from 'src/app/service/WebSocketDispositivos.service';
import { Subscription } from 'rxjs';
import { Zona_seguraService } from 'src/app/service/Zona_segura.service';
import { Posicion } from 'src/app/model/posicion.model';
import { HttpClient } from '@angular/common/http';
import { Dispositivo } from 'src/app/model/dispositivo.model';
import { Zona_segura } from 'src/app/model/zona_segura';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [
    GoogleMap, MapHeatmapLayer, CommonModule, MapMarker,HttpClientModule,
  ],
  templateUrl: './ubicaciones.component.html',
  styleUrl: './ubicaciones.component.scss'
})


export class UbicacionesComponent implements OnInit, OnDestroy{

  private dispositivosSuscripcion:Subscription;
  dispositivos: Dispositivo [] = [];
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  center: google.maps.LatLngLiteral = { lat: -2.879767894744873, lng: -78.97490692138672 };
  zoom = 12;
  private posicionSubscription: Subscription;
  posiciones: Posicion[] = [];
  zonasSeguras: Zona_segura[] = [];
  private zonasSegurasSubscription: Subscription;

  constructor(
    private webSocketPosicion: WebSocketDispositivos,
    private zone: NgZone,
    private http: HttpClient,
    private zonasSegurasService: Zona_seguraService
  ) {}

  ngOnInit(): void {
    this.listarZonasSeguras();
  }

  ngOnDestroy(): void {
    if (this.zonasSegurasSubscription) {
      this.zonasSegurasSubscription.unsubscribe();
    }
  }

  loadOtherPositionsMarkers() {
    // Obtener posiciones de otros dispositivos y agregar marcadores en el mapa
    this.listarposiciones();
    console.log(this.posiciones.length);
    const ruta = 'https://th.bing.com/th/id/R.e6d5549d7d43ef8e34af49fed37e1196?rik=nb2KWBpNv895Bw&pid=ImgRaw&r=0';
    //suscribirse al WebSocket para recibir actualización posiciones en tiempo real:
    this.posicionSubscription = this.webSocketPosicion.obtenerDispositivos().subscribe(
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
    this.dispositivosSuscripcion = this.webSocketPosicion.obtenerDispositivos().subscribe(
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

  onZonaSeguraChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedZonaSeguraId = selectElement.value;
    console.log('Zona segura seleccionada:', selectedZonaSeguraId);

    // Aquí puedes agregar lógica adicional para manejar el cambio de zona segura,
    // como actualizar la vista del mapa con nuevas posiciones u otros datos.
  }


  listarZonasSeguras() {
    this.zonasSegurasSubscription = this.zonasSegurasService.listar().subscribe(
      (zonas: Zona_segura[]) => {
        this.zonasSeguras = zonas;
      },
      error => {
        console.error('Error al listar zonas seguras:', error);
      }
    );
  }

  
}

function boostrapApplication(App: any, arg1: { providers: any[]; }) {
  throw new Error('Function not implemented.');
}
