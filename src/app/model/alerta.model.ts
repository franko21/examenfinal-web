import { Dispositivo } from "./dispositivo.model";

export class Alerta {
    id_alerta?: number;
    fecha?:Date;
    descripcion?:String;
    dispositivo?:Dispositivo;
}
