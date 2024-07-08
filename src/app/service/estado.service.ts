import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Estado } from '../model/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private urlEndPoint: string = environment.urlHost + 'api/estado';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  crear(estado: Estado): Observable<Estado> {
    return this.http.post<Estado>(this.urlEndPoint, estado, { headers: this.httpHeaders });
  }

  listar(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.urlEndPoint);
  }

  buscarporid(id: number): Observable<Estado> {
    return this.http.get<Estado>(`${this.urlEndPoint}/${id}`);
  }

  editar(estado: Estado): Observable<Estado> {
    const url = `${this.urlEndPoint}/${estado.idEstado}`;
    return this.http.put<Estado>(url, estado, { headers: this.httpHeaders });
  }
}
