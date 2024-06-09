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
    if (token) {
        this.currentUserLoginOn.next(true);
        this.currentUserData.next(token);
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(environment.urlHost + "auth/v1/signin", credentials).pipe(
        tap((userData) => {
            console.log("Datos de usuario recibidos:", userData);
            if (userData && userData.token) {
                sessionStorage.setItem("token", userData.token);
                this.currentUserData.next(userData.token);
                console.log("Token de sesión almacenado:", userData.token);
                // console.log("Token de sesión almacenado:", userData.empleado.nombre);
                this.currentUserLoginOn.next(true);
                console.log(this.currentUserLoginOn.value);
                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: 'Bienvenido de nuevo ',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result)=>{
                    if(result.isConfirmed){
                        environment.islogged=true;
                        environment.username=credentials.username;
                        // authGuard(this.route,this.state).valueOf.prototype.islogged=true;
                        this.router.navigate(['/dashboard']);
                    }
                }

                );
            } else {
                console.log("Datos de usuario recibidos:", userData);
                console.log(this.currentUserLoginOn.value);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: 'Error al ingresar los datos.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                console.error("Respuesta de inicio de sesión incompleta o sin token.");
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
                console.log("Datos de usuario recibidos:", userData);

                console.error("Respuesta de inicio de sesión incompleta o sin token.");
            }
        }),

        map((userData) => userData.token),
        catchError(this.handleError),

    );
}
logout(): void {
    sessionStorage.removeItem("token");
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
