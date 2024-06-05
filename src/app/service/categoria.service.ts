
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Categoria } from '../model/categoria.model';
@Injectable({
    providedIn: 'root'
  })
export class CategoriaService{
    private urlEndPoint:string = environment.urlApi+'api/categoria';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'}); 
    constructor(private http:HttpClient) { }

    crear(categoria: Categoria): Observable<Categoria>{
        return this.http.post<Categoria>(this.urlEndPoint, categoria,{headers: this.httpHeaders})
      }

      listar(): Observable<Categoria[]>{
        return this.http.get<Categoria[]>(this.urlEndPoint);
      }

      buscarporid(id: number):Observable<Categoria>{
        return this.http.get<Categoria>(`${this.urlEndPoint}/${id}`);
      }

      editar(categoria: Categoria): Observable<Categoria> {
        const id = `${this.urlEndPoint}/${categoria.id_categoria}`;
        return this.http.put<Categoria>(id, categoria, { headers: this.httpHeaders});
      }
    
      eliminar(id: number): Observable<Categoria>{
        return this.http.delete<Categoria>(`${this.urlEndPoint}/${id}`)
      }

}