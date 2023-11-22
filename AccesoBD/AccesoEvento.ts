import { Collection, Db, ObjectId } from "mongodb";
import { Evento } from "../Evento";

export class AccesoEvento{
    url: String;
    database: Db;
    collection: Collection;

    constructor(url: String, database: Db, collection: Collection){
        this.url = url;
        this.database = database;
        this.collection = collection;
    }

    public async getEvento(nombre: String) {
        const filtro = { nombre: nombre };
        const usuario = await this.collection.findOne(filtro);
        return usuario;
    }

    public async getEventoPorId(id: string) {
        const filtro = { _id: new ObjectId(id) };
        const usuario = await this.collection.findOne(filtro);
        return usuario;
    }

    public async getEventos(){
        return await this.collection.find().toArray();
    }

    public async subirEvento(evento: Evento){
        this.collection.insertOne(JSON.parse(JSON.stringify(evento)));
    }

    public async modificarEvento(evento: Evento, id: string){
        const filtro = { _id: new ObjectId(id) };
        this.collection.findOneAndReplace(filtro, JSON.parse(JSON.stringify(evento)));
    }

    public async borrarEvento(nombre: String){
        const filtro = { nombre: nombre };
        this.collection.findOneAndDelete(filtro);
    }

    public async getEventoTag(tags: Array<String>){
        console.log(tags)
        const filtro = { tags: { $in: tags } };
        console.log("filto")
        return await this.collection.find(filtro).toArray();
    }

    public async getTags(){
        return await this.collection.distinct("tags");
    }

    public async realizarAporte(titulo: string, descripcion: string, nombre: string, contribucion: string, idEvento: any){
        return await this.collection.updateOne({_id: idEvento}, { $push: {contribuciones: {
            titulo: titulo,
            descripcion: descripcion,
            nombreUsuario: nombre,
            contribucion: contribucion
        }} });
    }
}