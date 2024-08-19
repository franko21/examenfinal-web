import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Marca } from '../model/marca.model';
@Injectable({
    providedIn: 'root'
  })

export class MarcaService{
    private urlEndPoint:string = environment.urlHost+'api/marca';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
      constructor(private http:HttpClient) { }

      crear(marca: Marca): Observable<Marca>{
        return this.http.post<Marca>(this.urlEndPoint, marca,{headers: this.httpHeaders})
      }

      listar(): Observable<Marca[]>{
        return this.http.get<Marca[]>(this.urlEndPoint);
      }


      buscarporid(id: number):Observable<Marca>{
        return this.http.get<Marca>(`${this.urlEndPoint}/${id}`);
      }

      editar(marca: Marca): Observable<Marca> {
        const id = `${this.urlEndPoint}/${marca.id}`;
        return this.http.put<Marca>(id, marca, { headers: this.httpHeaders});
      }

  eliminar(id: number | undefined): Observable<Marca>{
        return this.http.delete<Marca>(`${this.urlEndPoint}/${id}`)
    }

}
