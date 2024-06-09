import { Persona } from "./persona";
import { Prestamo } from "./prestamo";

export class Usuario {
    id_usuario:number;
    persona:Persona
    username:String;
    password:String;
    prestamos:Prestamo[]
}
