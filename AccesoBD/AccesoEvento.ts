import { Collection, Db } from "mongodb";
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

    public async getEventos(){
        return await this.collection.find().toArray();
    }

    public async subirEvento(evento: Evento){
        this.collection.insertOne(JSON.parse(JSON.stringify(evento)));
    }

    public async modificarEvento(evento: Evento){
        const filtro = { nombre: evento.nombre };
        this.collection.findOneAndReplace(filtro, JSON.parse(JSON.stringify(evento)));
    }

    public async borrarEvento(nombre: String){
        const filtro = { nombre: nombre };
        this.collection.findOneAndDelete(filtro);
    }

    public async getEventoTag(tags: Array<String>){
        const filtro = { tags: { $in: tags } };
        return await this.collection.find(filtro).toArray();
    }

    public async getTags(){
        return await this.collection.distinct("tags");
    }
}