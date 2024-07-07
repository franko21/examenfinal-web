import { Punto } from "./punto.model";
import { Dispositivo } from "./dispositivo.model";

export class Zona_segura{
    idZonaSegura?:number;
    descripcion?:string;
    puntos?:Punto[];
    dispositivos?:Dispositivo[];
}
