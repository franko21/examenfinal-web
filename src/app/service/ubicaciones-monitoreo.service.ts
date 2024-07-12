import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UbicacionesMonitoreoService {
  private fijarPuntoSubject = new Subject<{ latitud: number, longitud: number }>();

  fijarPunto$ = this.fijarPuntoSubject.asObservable();

  fijarPunto(latitud: number, longitud: number) {
    console.log("desde el servicio:"+ latitud+" "+ longitud);
    this.fijarPuntoSubject.next({ latitud, longitud });
  }
}