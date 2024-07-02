import { Punto } from "./punto.model";
import { Dispositivo } from "./dispositivo.model";

export class Zona_segura{
    id_zona_segura?:number;
    descripcion?:string;
    puntos?:Punto[];
    dispositivos?:Dispositivo[];
}
