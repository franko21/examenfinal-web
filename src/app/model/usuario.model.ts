import { Persona } from "./persona.model";
import { Prestamo } from "./prestamo.model";

export class Usuario {
    id_usuario:number;
    persona:Persona
    username:String;
    password:String;
    prestamos:Prestamo[]
}
