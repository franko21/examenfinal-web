import { Injectable } from '@angular/core';
import { Prestamo } from '../model/prestamo.model';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http:HttpClient) { }

  crearPrestamo(prestamo: any): Observable<any> {
    return this.http.post<string>(`${environment.urlHost}api/prestamo`, prestamo).pipe(
      catchError(this.handleError)
    );
  }
  getPrestamos(): Observable<Prestamo[]> {

    return this.http.get(`${environment.urlHost}api/prestamo`).pipe(
      map(Response => Response as Prestamo[])

    );
  }
  editPrestamo(id:any,prestamo:Prestamo):Observable<any>{
    return this.http.put<Prestamo>(`${environment.urlHost}api/prestamo/${id}`,prestamo)
  }
  finalizarPrestamo(id:any,prestamo:Prestamo):Observable<any>{
    return this.http.put<Prestamo>(`${environment.urlHost}api/prestamo/finalizar/${id}`,prestamo)
  }
  deletePrestamo(id: any):Observable<any>{
    return this.http.delete<Prestamo>(`${environment.urlHost}api/prestamo/${id}`)
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El servidor retornó un código de error
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
