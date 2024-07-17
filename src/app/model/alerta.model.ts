import { Dispositivo } from "./dispositivo.model";

export class Alerta {
    id_alerta?: number;
    fecha?:Date;
    descripcion?:string;
    visto?:boolean;
    dispositivo?:Dispositivo;
}
