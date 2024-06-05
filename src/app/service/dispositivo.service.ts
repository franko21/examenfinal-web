
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Dipositivo } from '../model/dispositivo.model';
@Injectable({
    providedIn: 'root'
  })
export class DipositivoService{
    private urlEndPoint:string =environment.urlApi+'api/dispositivo';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
    constructor(private http:HttpClient) { }
    
      crear(dispositivo: Dipositivo): Observable<Dipositivo>{
        return this.http.post<Dipositivo>(this.urlEndPoint, dispositivo,{headers: this.httpHeaders})
      }

      listar(): Observable<Dipositivo[]>{
        return this.http.get<Dipositivo[]>(this.urlEndPoint);
      }

      buscarporid(id: number):Observable<Dipositivo>{
        return this.http.get<Dipositivo>(`${this.urlEndPoint}/${id}`);
      }

      editar(dispositivo: Dipositivo): Observable<Dipositivo> {
        const id = `${this.urlEndPoint}/${dispositivo.id_dispositivo}`;
        return this.http.put<Dipositivo>(id, dispositivo, { headers: this.httpHeaders});
      }
    
      eliminar(id: number): Observable<Dipositivo>{
        return this.http.delete<Dipositivo>(`${this.urlEndPoint}/${id}`)
      }
 

}