import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Punto } from '../model/Punto';

@Injectable({
    providedIn: 'root'
})

export class PuntoService {

    private UrlEndPoint:string = 'http://localhost:8080/api/Punto';
    private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) { }

    listar(): Observable<Punto[]>{
        return this.http.get<Punto[]>(this.UrlEndPoint);
      }
    
      buscar(id_punto: number):Observable<Punto>{
        return this.http.get<Punto>(`${this.UrlEndPoint}/${id_punto}`);
      }
    
      crear(punto: Punto): Observable<Punto>{
        return this.http.post<Punto>(this.UrlEndPoint, punto,{headers: this.httpHeaders})
      }
    
      editar(punto: Punto): Observable<Punto> {
        const id_punto = `${this.UrlEndPoint}/${punto.id_punto}`;
        return this.http.put<Punto>(id_punto, punto, { headers: this.httpHeaders});
      }
    
      eliminar(id_punto: number): Observable<Punto>{
        return this.http.delete<Punto>(`${this.UrlEndPoint}/${id_punto}`)
      }

    
}