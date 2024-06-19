import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Prestamo} from "../model/prestamo";
import {environment} from "../../enviroments/environment";
import {Rol} from "../model/rol";

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http:HttpClient) { }

  getRoles(): Observable<Rol[]> {
    return this.http.get(`${environment.urlHost}api/rol`).pipe(
      map(Response => Response as Rol[])

    );
  }


}
