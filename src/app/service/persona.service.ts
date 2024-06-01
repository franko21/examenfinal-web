import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http:HttpClient) { }

  crearPersona(persona: any,id:number): Observable<any> {
    return this.http.post<string>(`${environment.urlHost}api/persona/crear/${id}`, persona).pipe(
      catchError(this.handleError)
    );
  }
  obteenerPersonaXCedula(cedula:String): Observable<number> {
    return this.http.get<number>(`${environment.urlHost}api/persona/cedula/${cedula}`).pipe(
      catchError(this.handleError)
    );
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
