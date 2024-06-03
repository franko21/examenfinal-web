import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';

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
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  lastClickedPosition: google.maps.LatLngLiteral | null = null;

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const position = event.latLng.toJSON();
      this.markerPositions.push(position);
      this.lastClickedPosition = position;
    }
  }

  trackByFn(index: number, item: any) {
    return index;
  }
}
