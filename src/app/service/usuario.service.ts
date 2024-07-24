import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Usuario } from '../model/usuario.model';
import { Persona } from "../model/persona.model";
import { image } from 'html2canvas/dist/types/css/types/image';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getUsuarioByUsername(username: any): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.urlHost}api/usuarios/existe/${username}`).pipe(
      catchError(this.handleError)
    );
  }
  updateUsuario(usuario: Usuario, imagen: File | null): Observable<any> {
    let formData = new FormData();
    if (imagen) {
      formData.append('imagen', imagen);
    }
    formData.append("usuario", JSON.stringify(usuario));
    return this.http.put(`${environment.urlHost}api/usuarios/${usuario.idUsuario}`, formData);
  }


  crearPersona(persona: any, id: number): Observable<any> {
    return this.http.post<string>(`${environment.urlHost}api/persona/crear/${id}`, persona).pipe(
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
