import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, BehaviorSubject, tap, map } from 'rxjs';
import { LoginRequest } from './LoginRequest';
import { environment } from '../../../../enviroments/environment';
import { RegisterRequest } from './RegisterRequest';
import Swal from "sweetalert2";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from 'src/app/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  currentUserLoginOn: BehaviorSubject<boolean>;
  currentUserData: BehaviorSubject<string>;

  constructor(private http:HttpClient,private router:Router) {

    this.currentUserLoginOn = new BehaviorSubject<boolean>(false);
    this.currentUserData = new BehaviorSubject<string>("");

    // Comprueba si hay un token en el sessionStorage al inicializar el servicio
    const token = sessionStorage.getItem("token");
    const usuario = sessionStorage.getItem("usuario");
    if (token) {
        this.currentUserLoginOn.next(true);
        this.currentUserData.next(token);
    }
  }
  getLogin(username: any,clave:any):Observable< boolean >{
    return this.http.get<boolean>(`${environment.urlHost}api/admin/${username}/${clave}`).pipe(
      catchError(this.handleError)
    );
  }
  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(environment.urlHost + "auth/v1/signin", credentials).pipe(
        tap((userData) => {
            if (userData!==null && userData.token) {
                console.log("Datos de usuario recibidos:", userData);
                sessionStorage.setItem("token", userData.token);

                this.currentUserData.next(userData.token);
                console.log("Token de sesión almacenado:", userData.token);
                console.log(userData.usuario);
                this.currentUserLoginOn.next(true);
                console.log(this.currentUserLoginOn.value);
                this.router.navigate(['/monitoreo']);
            } else {
                // console.log("Datos de usuario recibidos:", userData);               console.error("Respuesta de inicio de sesión incompleta o sin token.");
            }
        }),

        map((userData) => userData.token),
        catchError(this.handleError),

);
}

register(credentials: RegisterRequest): Observable<any> {
    return this.http.post<any>(environment.urlHost + "auth/register", credentials).pipe(
        tap((userData) => {
            console.log("Datos de usuario recibidos:", userData);
            if (userData && userData.token) {
                sessionStorage.setItem("token", userData.token);
                this.currentUserData.next(userData.token);
                console.log("Token de sesión almacenado:", userData.token);
                this.currentUserLoginOn.next(true);
            } else {
                console.error("Respuesta de inicio de sesión incompleta o sin token.");
            }
        }),

        map((userData) => userData.token),
        catchError(this.handleError),

    );
}
logout(): void {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("cedula");
    sessionStorage.removeItem("nombre");
    sessionStorage.removeItem("apellido");
    this.currentUserData.next('');
    this.currentUserLoginOn.next(false);
    console.log("Sesión cerrada. Token eliminado.");
}
public isLoggedIn(): boolean {
    return this.currentUserLoginOn.value;
  }

private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
        console.error('Se ha producido un error:', error);
    } else {
        console.error('Backend retornó el código de estado:', error.status);
    }
    return throwError('Algo falló. Por favor, inténtelo nuevamente.');
}
}
