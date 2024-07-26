import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Punto } from '../model/punto.model';
import { environment } from '../../enviroments/environment';

@Injectable({
    providedIn: 'root'
})

export class PuntoService {

    private urlEndPoint:string = environment.urlHost+'api/Punto';
    private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) { }

    listar(): Observable<Punto[]>{
        return this.http.get<Punto[]>(this.urlEndPoint);
    }
    
    buscar(id_punto: number):Observable<Punto>{
      return this.http.get<Punto>(`${this.urlEndPoint}/${id_punto}`);
    }
    
    crear(punto: Punto): Observable<Punto>{
      return this.http.post<Punto>(this.urlEndPoint, punto,{headers: this.httpHeaders})
    }      
    
    eliminar(id_punto: number): Observable<Punto>{
        return this.http.delete<Punto>(`${this.urlEndPoint}/${id_punto}`)
    }

    actualizar(punto: Punto): Observable<Punto> {
      const id_punto = `${this.urlEndPoint}/${punto.id_punto}`;
      return this.http.put<Punto>(id_punto, punto, { headers: this.httpHeaders});
    }

    BuscarPorZonaSegura(id_zona:number):Observable<Punto[]>{
      return this.http.get<Punto[]>(`${this.urlEndPoint+'/puntosPorZonaSegura'}/${id_zona}`);
    }
    
}