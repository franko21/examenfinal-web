
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Historico } from '../model/historico.model';
@Injectable({
    providedIn: 'root'
  })
export class HistoricoService{
    private urlEndPoint:string = environment.urlHost+'api/historicos';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'}); 
    constructor(private http:HttpClient) { }

    crear(historico: Historico): Observable<Historico>{
        return this.http.post<Historico>(this.urlEndPoint, historico,{headers: this.httpHeaders})
      }

      listar(): Observable<Historico[]>{
        return this.http.get<Historico[]>(this.urlEndPoint);
      }

      buscarporid(id: number):Observable<Historico>{
        return this.http.get<Historico>(`${this.urlEndPoint}/${id}`);
      }

      editar(categoria: Historico): Observable<Historico> {
        const id = `${this.urlEndPoint}/${categoria.idHistorico}`;
        return this.http.put<Historico>(id, categoria, { headers: this.httpHeaders});
      }
    
      eliminar(id: number): Observable<Historico>{
        return this.http.delete<Historico>(`${this.urlEndPoint}/${id}`)
      }

}