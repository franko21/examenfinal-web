import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Zona_segura } from '../model/zona_segura';

@Injectable({
  providedIn: 'root'
})
export class Zona_seguraService {

  private UrlEndPoint: string = 'http://localhost:8080/api/zona_segura';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Zona_segura[]> {
    return this.http.get<Zona_segura[]>(this.UrlEndPoint);
  }

  buscar(id_auto: number): Observable<Zona_segura> {
    return this.http.get<Zona_segura>(`${this.UrlEndPoint}/${id_auto}`);
  }

  crear(zona: Zona_segura): Observable<Zona_segura> {
    return this.http.post<Zona_segura>(this.UrlEndPoint, zona, { headers: this.httpHeaders });
  }

  editar(zona: Zona_segura): Observable<Zona_segura> {
    const id_zona = `${this.UrlEndPoint}/${zona.idZonaSegura}`;
    return this.http.put<Zona_segura>(id_zona, zona, { headers: this.httpHeaders });
  }

  eliminar(id_auto: number): Observable<Zona_segura> {
    return this.http.delete<Zona_segura>(`${this.UrlEndPoint}/${id_auto}`);
  }

  BuscarPorNombre(descripcion: string): Observable<Zona_segura[]> {
    return this.http.get<Zona_segura[]>(`${this.UrlEndPoint+'/descripcion/'}${descripcion}`);
  }
}

