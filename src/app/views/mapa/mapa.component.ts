import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, MapHeatmapLayer, MapMarker} from '@angular/google-maps';
import { Punto } from "src/app/model/Punto";
import { Zona_segura } from 'src/app/model/Zona_segura';
import { PuntoService } from "src/app/service/Punto.service";
import { Zona_seguraService } from 'src/app/service/Zona_segura.service';
import { PosicionService} from "src/app/service/posicion.service";
import { WebSocketPosicion} from "src/app/service/WebSocketPosicion.service";

import { Posicion } from "src/app/model/posicion.model";
import Swal from 'sweetalert2';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss',
  imports: [
    GoogleMap, MapHeatmapLayer, CommonModule, MapMarker,HttpClientModule,
  ],
  providers: [PuntoService,Zona_seguraService, PosicionService]
})
export class MapaComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: -2.879767894744873, lng: -78.97490692138672 };
  zoom = 12;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  lastClickedPosition: google.maps.LatLngLiteral | null = null;
  marker: google.maps.Marker | null = null;
  listadoPuntos: any[] = [];
  verticesPoligono = [];

  posiciones: Posicion[] = [];
  private posicionSubscription: Subscription;
  mostrarZonas: boolean = true;

  constructor(
    private webSocketPosicion: WebSocketPosicion,
    private posicionService: PosicionService,
    private puntoService: PuntoService,
    private zonaService: Zona_seguraService
  ) {}

  ngOnInit(): void {
    this.listarposiciones();
    //suscribirse al WebSocket para recibir actualización posiciones en tiempo real:
    this.posicionSubscription = this.webSocketPosicion.obtenerPosiciones().subscribe(
      (posiciones: any[]) => {
        this.posiciones = posiciones.map(pos => ({
          latitud: pos.lat, // Asegúrate de que 'lat' y 'lng' correspondan a las propiedades correctas
          longitud: pos.lng
        }));
      },
      error => {
        console.error('Error al suscribirse a las posiciones:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.posicionSubscription) {
      this.posicionSubscription.unsubscribe();
    }
  }

  
  listarposiciones() {
    this.posicionService.listar().subscribe(
      (posiciones: Posicion[]) => {
        this.posiciones = posiciones;
      },
      error => {
        console.error('Error al listar posiciones:', error);
      }
    );
  }
  
  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const position = event.latLng.toJSON();
      this.lastClickedPosition = position;
      const punto = {
        latitud: this.lastClickedPosition.lat,
        longitud: this.lastClickedPosition.lng
      };
      this.listadoPuntos.push(punto);
      console.log('Cantidad de puntos:', this.listadoPuntos.length);
      this.actualizarMarcadorEnMapa(position);
    }
  }

  ingresarZona() {
    if (this.listadoPuntos.length < 3) {
      Swal.fire({
        icon: 'error',
        title: 'Error al ingresar la zona segura',
        text: 'DEBES SELECCIONAR POR LO MENOS 3 PUNTOS EN EL MAPA.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    } else {
      const zona = new Zona_segura();
      zona.descripcion = "Zona del ISTA";
      this.zonaService.crear(zona).subscribe({
        next: (data) => {
          console.log(data.id_zona_segura);
          this.listadoPuntos.forEach(punto => {
            punto.zona_segura = data;
          });
          this.IngresarPuntos();
          Swal.fire({
            icon: 'success',
            title: 'Zona segura ingresada correctamente',
            text: 'Realizado.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al ingresar la zona segura',
            text: err.message || 'Ocurrió un error desconocido.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }

  IngresarPuntos() {
    this.listadoPuntos.forEach(punto => {
      this.puntoService.crear(punto).subscribe({
        next: (data) => {
          data.id_punto;
          const mapContainer = this.map.googleMap;
          if (mapContainer) {
            const vertices = this.listadoPuntos.map(punto => ({
              lat: punto.latitud,
              lng: punto.longitud
            }));
            const poligono = new google.maps.Polygon({
              paths: vertices,
              map: mapContainer,
              strokeColor: '#FF0000',
              fillColor: '#B9D7FF',
              strokeWeight: 4,
            });
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    });
  }

  actualizarMarcadorEnMapa(position: google.maps.LatLngLiteral) {
    this.marker = new google.maps.Marker({
      position: position,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        strokeColor: '#f00',
        strokeWeight: 5,
        fillColor: '#000A02',
        fillOpacity: 1
      },
      map: this.map?.googleMap || null
    });
  }

  toggleView() {
    this.mostrarZonas = !this.mostrarZonas;
  }


  trackByFn(index: number, item: any) {
    return index;
  }
}