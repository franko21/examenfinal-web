import { CommonModule } from '@angular/common';
import { Component, ViewChild} from '@angular/core';
import {GoogleMap, MapHeatmapLayer, MapMarker} from '@angular/google-maps';
import { Punto } from "src/app/model/Punto";
import { Zona_segura } from 'src/app/model/Zona_segura';
import { PuntoService } from "src/app/service/Punto.service";
import { Zona_seguraService } from 'src/app/service/Zona_segura.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss',
  imports: [
    GoogleMap, MapHeatmapLayer, CommonModule, MapMarker
  ],
  providers: [PuntoService,Zona_seguraService]
})
export class MapaComponent {
  constructor(puntoService:PuntoService,ZonaService:Zona_seguraService) {
    this.puntoService = puntoService;
    this.zonaService = ZonaService;
  }
  //OBJETOS NECESARIOS PARA EL MAPA Y LOS PUNTOS
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  center: google.maps.LatLngLiteral = { lat: -2.879767894744873, lng: -78.97490692138672};
  zoom = 12;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  lastClickedPosition: google.maps.LatLngLiteral | null = null;
  marker: google.maps.Marker | null = null;
  listadoPuntos: Punto[] = [];
  //SERVICIOS NECESARIOS PARA LA ZONA SEGURA Y LOS PUNTOS
  private puntoService:PuntoService;
  private zonaService:Zona_seguraService;

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const position = event.latLng.toJSON();
      this.lastClickedPosition = position;
      var punto = new Punto();
      punto.latitud = this.lastClickedPosition.lat;
      punto.longitud = this.lastClickedPosition.lng;
      this.listadoPuntos.push(punto);
      console.log(this.listadoPuntos.length);
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
        map: null
      });
      this.handleMarker(this.marker);
    }
  }

  handleMarker(marker: google.maps.Marker) {
    if (this.map && this.map.googleMap) {
      marker.setMap(this.map.googleMap);
    } else {
      console.error('Mapa no inicializado.');
    }
  }

  ingresarZona(){
    if(this.listadoPuntos.length < 3){
      Swal.fire({
        icon: 'error',
        title: 'Error al ingresar la zona segura',
        text: 'DEBES SELECCIONAR POR LO MENOS 3 PUNTOS EN EL MAPA.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }else{
      var zona = new Zona_segura();
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

  IngresarPuntos(){ 
    this.listadoPuntos.forEach(punto => {
      this.puntoService.crear(punto).subscribe({
        next: (data) => {
          data.id_punto
          console.log("se ingresó el punto correctamente");
        },
        error: (err) => {
          console.error(err);
        }
      });
    });
  }

  trackByFn(index: number, item: any) {
    return index;
  }
}
