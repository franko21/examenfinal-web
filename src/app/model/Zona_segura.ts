import { Punto } from "./punto.model";
import { Dispositivo } from "./dispositivo.model";

export class Zona_segura{
    id_zona_segura:number=0;
    descripcion:string="";
    puntos:Punto []=[];
    dispositivos:Dispositivo[] = [];
}
