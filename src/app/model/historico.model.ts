import { Dispositivo } from "./dispositivo.model";

export class Historico {
    id_historico?: number;
    latitud?: number;
    longitud?: number;
    fechaHora?: Date;
    dispositivo?: Dispositivo;
}