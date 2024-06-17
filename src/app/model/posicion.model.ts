
import { Dispositivo } from "./dispositivo.model";

export class Posicion{
    id_posicion?: number;
    latitud: number;
    longitud: number;
    fecha_hora?:boolean;
    nivel_bateria?:number;
    activo?:boolean;
    dispositivo?: Dispositivo;
}