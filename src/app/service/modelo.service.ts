import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Dispositivo } from '../model/dispositivo.model';
import { Modelo } from '../model/modelo.model';
@Injectable({
    providedIn: 'root'
  })
  
export class ModeloService{
    private urlEndPoint:string = environment.urlHost+'api/modelo';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
      constructor(private http:HttpClient) { }

      crear(modelo: Modelo): Observable<Modelo>{
        return this.http.post<Modelo>(this.urlEndPoint, modelo,{headers: this.httpHeaders})
      }

      listar(): Observable<Modelo[]>{
        return this.http.get<Modelo[]>(this.urlEndPoint);
      }

      buscarporid(id: number):Observable<Modelo>{
        return this.http.get<Modelo>(`${this.urlEndPoint}/${id}`);
      }

      editar(modelo: Modelo): Observable<Modelo> {
        const id = `${this.urlEndPoint}/${modelo.id_modelo}`;
        return this.http.put<Modelo>(id, modelo, { headers: this.httpHeaders});
      }
    
      eliminar(id: number): Observable<Modelo>{
        return this.http.delete<Modelo>(`${this.urlEndPoint}/${id}`)
      }

}