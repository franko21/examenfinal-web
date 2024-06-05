import { Injectable } from '@angular/core';
import { Prestamo } from '../model/prestamo';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http:HttpClient) { }

  getPrestamos(): Observable<Prestamo[]> {

    return this.http.get(`${environment.urlHost}api/prestamo`).pipe(
      map(Response => Response as Prestamo[])
  
    );
  }
  deletePrestamo(id: any):Observable<any>{
    return this.http.delete<Prestamo>(`${environment.urlHost}api/prestamo/${id}`)
  }
}
