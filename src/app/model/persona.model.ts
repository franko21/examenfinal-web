import {Rol} from "./rol.model";

export class Persona {
    cedula:String;
    nombre:String;
    apellido:String;
    id_persona:number;
    imagen:String;
    descripcion:String;
    rol:Rol;
    fecha_registro:Date;
}
