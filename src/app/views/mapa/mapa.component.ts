import { CommonModule } from '@angular/common';
import { Component, ViewChild} from '@angular/core';
import {GoogleMap, MapHeatmapLayer, MapMarker} from '@angular/google-maps';
@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss',
  imports: [
    GoogleMap, MapHeatmapLayer, CommonModule, MapMarker
  ],
})
export class MapaComponent {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  center: google.maps.LatLngLiteral = { lat: -2.879767894744873, lng: -78.97490692138672};
  zoom = 12;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  lastClickedPosition: google.maps.LatLngLiteral | null = null;
  marker: google.maps.Marker | null = null;

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const position = event.latLng.toJSON();
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

  trackByFn(index: number, item: any) {
    return index;
  }
}
