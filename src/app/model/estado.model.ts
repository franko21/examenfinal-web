import { Dispositivo } from "./dispositivo.model";

export class Estado {
    idEstado?: number;
    fechActualizacion?: Date;
    nivelBateria?: number;
    cargando?:boolean;
    gps?:boolean;
    phoneState?:boolean;
    notificaciones?:boolean;
    localizacion?:boolean;
    conexionInternet?:boolean;
    dispositivo?: Dispositivo;
}