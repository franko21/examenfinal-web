import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Persona } from '../model/persona.model';
import { map } from 'rxjs';
import {Prestamo} from "../model/prestamo.model";

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
  getPersonas(): Observable<Persona[]> {

    return this.http.get(`${environment.urlHost}api/persona`).pipe(
      map(Response => Response as Persona[])

    );
  }
  editPersona(id:any,persona:Persona):Observable<any>{
    return this.http.put<Persona>(`${environment.urlHost}api/persona/${id}`,persona)
  }

  deletePersona(id: any):Observable<any>{
    return this.http.delete<Persona>(`${environment.urlHost}api/persona/${id}`)
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
