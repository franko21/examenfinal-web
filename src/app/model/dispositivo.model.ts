import { Zona_segura } from "./zona_segura";
import { Estado } from "./estado.model";
import { Categoria } from "./categoria.model";
import { Modelo } from "./modelo.model";
import { Posicion } from "./posicion.model";
import { Historico } from "./historico.model";
import { Prestamo } from "./prestamo.model";
import { Alerta } from "./alerta.model";

export class Dispositivo {
    idDispositivo?: number;
    ipMac?: String;
    nombre?: String;
    numSerie?: String;
    version?: String;
    disponible?:boolean;
    vinculado?: boolean;
    categoria?:Categoria;
    modelo?:Modelo;
    zonaSegura?:Zona_segura;
    estado?:Estado;
    posicion?:Posicion;
    historicos?:Historico[];
    prestamos?:Prestamo[];
    alertas?: Alerta[];
}   
