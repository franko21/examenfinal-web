import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Posicion } from '../model/posicion.model';

@Injectable({
  providedIn: 'root'
})
export class PosicionService {

  private urlEndPoint: string = environment.urlHost + 'api/posicion';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  crear(posicion: Posicion): Observable<Posicion> {
    return this.http.post<Posicion>(this.urlEndPoint, posicion, { headers: this.httpHeaders });
  }

  listar(): Observable<Posicion[]> {
    return this.http.get<Posicion[]>(this.urlEndPoint);
  }

  buscarporid(id: number): Observable<Posicion> {
    return this.http.get<Posicion>(`${this.urlEndPoint}/${id}`);
  }

  editar(posicion: Posicion): Observable<Posicion> {
    const url = `${this.urlEndPoint}/${posicion.idPosicion}`;
    return this.http.put<Posicion>(url, posicion, { headers: this.httpHeaders });
  }

  eliminar(id: number): Observable<Posicion> {
    return this.http.delete<Posicion>(`${this.urlEndPoint}/${id}`);
  }
}
