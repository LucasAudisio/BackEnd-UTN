export class LugarDesarrollo{
    id: Number;
    pais: String;
    subdivision: String;
    localidad: String;
    direccion: String;

    constructor(id: Number, pais: String, subdivision: String, localidad: String, direccion: String){
        this.direccion = direccion;
        this.id = id;
        this.localidad = localidad;
        this.pais = pais;
        this.subdivision = subdivision;
    }
}