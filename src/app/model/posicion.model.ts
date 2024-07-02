
import { Dispositivo } from "./dispositivo.model";

export class Posicion{
    idPosicion?: number;
    latitud: number;
    longitud: number;
    fechaActualizacion?:Date;
    dentro?:boolean;
    dispositivo?: Dispositivo;
}