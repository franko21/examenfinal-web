import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/environment';
import { map } from 'rxjs';
import { Alerta } from '../model/alerta.model';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  private urlEndPoint:string = environment.urlHost+'api/alerta';
  constructor(private http:HttpClient) { }

  getAlertas(): Observable<Alerta[]> {
    return this.http.get(`${environment.urlHost}api/alerta`).pipe(
      map(Response => Response as Alerta[])
    );
  }

  listar(): Observable<Alerta[]>{
    return this.http.get<Alerta[]>(this.urlEndPoint);
  }

  crear(alerta: Alerta): Observable<Alerta> {
    return this.http.post<Alerta>(this.urlEndPoint, alerta, { headers: this.httpHeaders });
  }
}
