import { Categoria } from "./categoria.model";
import { Modelo } from "./modelo.model";

export class Dispositivo {
    id_dispositivo?: number;
    nombre?: String;
    numero_serie?: String;
    disponible?:boolean;
    id_categoria?:number;
    categoria?:Categoria;
    id_modelo?:Modelo;
    modelo?:Modelo;
    




    
}   
