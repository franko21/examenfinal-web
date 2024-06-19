import {Rol} from "./rol";

export class Persona {

    // constructor(
    //     public cedula:String,
    //     public nombre:String,
    //     public apellido:String
    // ){}
    cedula:String;
    nombre:String;
    apellido:String;
    id_persona:number;
    rol:Rol;
    fecha_registro:Date;
}
