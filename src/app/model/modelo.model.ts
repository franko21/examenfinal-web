import { Dispositivo } from "./dispositivo.model";
import { Marca } from "./marca.model";

export class Modelo{
    id_modelo?:number;
    nombre?:String;
    marca?:Marca;
    dispositivos?:Dispositivo[];
    


}