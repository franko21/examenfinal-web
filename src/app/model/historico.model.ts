import { Dispositivo } from "./dispositivo.model";

export class Historico {
    idHistorico?: number;
    latitud?: number;
    longitud?: number;
    fecha?: Date;
    dispositivo?: Dispositivo;
}