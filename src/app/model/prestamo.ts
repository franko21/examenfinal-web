import { Persona } from "./persona";
import { Zona_segura } from '../model/Zona_segura';
import { Alerta } from "./alerta";
import { Dipositivo } from "./dispositivo.model";
import { Usuario } from "./usuario";
export class Prestamo {
    id_prestamo:number;
    fecha_prestamo:Date;
    hora_prestamo:number;
    fecha_finalizacion:Date;
    motivo_prestamo:String;
    estado_devolucion:String;
    finalizado:boolean;
    persona:Persona;
    zona_segura:Zona_segura;
    dispositivo:Dipositivo;
    usuario:Usuario;
    listado_alertas:Alerta[];
}
