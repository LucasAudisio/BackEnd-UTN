import { LugarDesarrollo } from "./LugarDesarrollo";
import { Investigador } from "./Investigador";
import { Tag } from "./Tag";

export class Evento{
    nombre: String;
    fecha: Date;
    fechaCierreConvocatoria: Date;
    lugarDesarrollo: LugarDesarrollo;
    tags: Array<Tag>;
    usuarios: Array<Investigador>;
    
    constructor(nombre: String, fecha: Date, fechaCierreConvocatoria: Date, 
        lugarDesarrollo: LugarDesarrollo, tags: Array<Tag>, usuarios: Array<Investigador>){
            this.fecha = fecha;
            this.fechaCierreConvocatoria = fechaCierreConvocatoria;
            this.lugarDesarrollo = lugarDesarrollo;
            this.nombre = nombre;
            this.tags = tags;
            this.usuarios = usuarios;
    }
}