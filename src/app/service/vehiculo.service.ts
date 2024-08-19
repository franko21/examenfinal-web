import { Injectable } from '@angular/core';
import {environment} from "../../enviroments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Marca} from "../model/marca.model";
import {Observable} from "rxjs";
import {Vehiculo} from "../model/vehiculo.model";

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private urlEndPoint:string = environment.urlHost+'api/vehiculo';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
  constructor(private http:HttpClient) { }

  crear(vehiculo: Vehiculo): Observable<Vehiculo>{
    return this.http.post<Vehiculo>(this.urlEndPoint, vehiculo,{headers: this.httpHeaders})
  }

  listar(): Observable<Vehiculo[]>{
    return this.http.get<Vehiculo[]>(this.urlEndPoint);
  }


  buscarporid(id: number):Observable<Vehiculo>{
    return this.http.get<Vehiculo>(`${this.urlEndPoint}/${id}`);
  }

  editar(vehiculo: Vehiculo): Observable<Vehiculo> {
    const id = `${this.urlEndPoint}/${vehiculo.id}`;
    return this.http.put<Marca>(id, vehiculo, { headers: this.httpHeaders});
  }

  eliminar(id: number): Observable<Vehiculo>{
    return this.http.delete<Vehiculo>(`${this.urlEndPoint}/${id}`)
  }

}
