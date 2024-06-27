import { Zona_segura } from "./zona_segura";
import { Categoria } from "./categoria.model";
import { Modelo } from "./modelo.model";
import { Posicion } from "./posicion.model";
import { Historico } from "./historico.model";
import { Prestamo } from "./prestamo.model";

export class Dispositivo {
    idDispositivo?: number;
    ipMac?: String;
    nombre?: String;
    numSerie?: String;
    disponible?:boolean;
    "categoria":Categoria;
    "modelo":Modelo;
    zona_segura?:Zona_segura;
    posicion?:Posicion;
    historicos?:Historico[];
    prestamos?:Prestamo[];
}   
