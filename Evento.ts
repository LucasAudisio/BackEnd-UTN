import { LugarDesarrollo } from "./LugarDesarrollo";
import { Investigador } from "./Investigador";
import { Tag } from "./Tag";

export class Evento{
    nombre: String;
    fecha: Date;
    fechaCierreConvocatoria: Date;
    lugarDesarrollo: LugarDesarrollo;
    tags: Array<Tag>;
    usuarios: Array<String>;
    
    constructor(nombre: String, fecha: Date, fechaCierreConvocatoria: Date,
        lugarDesarrollo: LugarDesarrollo, tags: Array<Tag>, usuarios: Array<String>){
            this.fecha = fecha;
            this.fechaCierreConvocatoria = fechaCierreConvocatoria;
            this.lugarDesarrollo = lugarDesarrollo;
            this.nombre = nombre;
            this.tags = tags;
            this.usuarios = usuarios;
    }
}