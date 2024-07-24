import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Zona_segura } from '../model/zona_segura';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class Zona_seguraService {

  private urlEndPoint:string = environment.urlHost+'api/zona_segura';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Zona_segura[]> {
    return this.http.get<Zona_segura[]>(this.urlEndPoint);
  }

  buscar(id_auto: number): Observable<Zona_segura> {
    return this.http.get<Zona_segura>(`${this.urlEndPoint}/${id_auto}`);
  }

  crear(zona: Zona_segura): Observable<Zona_segura> {
    return this.http.post<Zona_segura>(this.urlEndPoint, zona, { headers: this.httpHeaders });
  }

  updatePosicion(zona: Zona_segura): Observable<Zona_segura> {
    const id_zona = `${this.urlEndPoint}/${zona.idZonaSegura}`;
    return this.http.put<Zona_segura>(id_zona, zona, { headers: this.httpHeaders });
  }

  eliminar(id_auto: number): Observable<Zona_segura> {
    return this.http.delete<Zona_segura>(`${this.urlEndPoint}/${id_auto}`);
  }

  BuscarPorNombre(descripcion: string): Observable<Zona_segura[]> {
    return this.http.get<Zona_segura[]>(`${this.urlEndPoint+'/descripcion/'}${descripcion}`);
  }
}


