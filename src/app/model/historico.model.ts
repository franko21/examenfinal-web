import { Dispositivo } from "./dispositivo.model";

export class Historico {
    idHistorico?: number;
    latitud?: number;
    longitud?: number;
    fechaHora?: Date;
    dispositivo?: Dispositivo;
}