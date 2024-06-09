import { Zona_segura } from '../model/Zona_segura';

export class Punto{
    latitud:number=0;
    longitud:number=0;
    id_punto:number=0;
    id_zona_segura:number=0;
    zona_segura:Zona_segura=new Zona_segura();
    
}