import { Persona } from "./persona.model";
import { Dispositivo } from "./dispositivo.model";
import { Usuario } from "./usuario.model";
export class Prestamo {
    id_prestamo:number;
    fecha_prestamo:Date;
    fecha_finalizacion:Date;
    motivo_prestamo:String;
    estado_devolucion:String;
    finalizado:boolean;
    dispositivo:Dispositivo;
    persona:Persona;
    usuario:Usuario;
}
