
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Dispositivo } from '../model/dispositivo.model';
@Injectable({
    providedIn: 'root'
  })
export class DipositivoService{
    private urlEndPoint:string =environment.urlHost+'api/dispositivo';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
    constructor(private http:HttpClient) { }
    
      crear(dispositivo: Dispositivo): Observable<Dispositivo>{
        return this.http.post<Dispositivo>(this.urlEndPoint, dispositivo,{headers: this.httpHeaders})
      }

      listar(): Observable<Dispositivo[]>{
        return this.http.get<Dispositivo[]>(this.urlEndPoint);
      }

      buscarporid(id: number):Observable<Dispositivo>{
        return this.http.get<Dispositivo>(`${this.urlEndPoint}/${id}`);
      }

      buscarporzonasegura(idZonaSegura: number): Observable<Dispositivo[]>{
        return this.http.get<Dispositivo[]>(`${this.urlEndPoint+'PorZonaSegura'}/${idZonaSegura}`);
      }
      

      editar(dispositivo: Dispositivo): Observable<Dispositivo> {
        const id = `${this.urlEndPoint}/${dispositivo.idDispositivo}`;
        return this.http.put<Dispositivo>(id, dispositivo, { headers: this.httpHeaders});
      }
    
      eliminar(id: number): Observable<Dispositivo>{
        return this.http.delete<Dispositivo>(`${this.urlEndPoint}/${id}`)
      }
 

}