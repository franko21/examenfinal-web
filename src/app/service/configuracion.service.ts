
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Configuracion } from '../model/configuracion';

@Injectable({
    providedIn: 'root'
})
export class ConfiguracionService {
    private urlEndPoint: string = environment.urlHost +'api/configuraciones';
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    constructor(private http: HttpClient) { }

    crear(configuracion: Configuracion): Observable<Configuracion> {
        return this.http.post<Configuracion>(this.urlEndPoint, configuracion, { headers: this.httpHeaders })
    }
    listar(): Observable<Configuracion[]>{
        return this.http.get<Configuracion[]>(this.urlEndPoint);
    }

    


  

     

}