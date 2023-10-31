import { Collection, Db } from "mongodb";
import { LugarDesarrollo } from "../LugarDesarrollo";

export class AccesoLugar{
    url: String;
    database: Db;
    collection: Collection;

    constructor(url: String, database: Db, collection: Collection){
        this.url = url;
        this.database = database;
        this.collection = collection;
    }

    public async getLugares(){
        return await this.collection.find().toArray();
    }

    public async getLugar(nombre: String){
        const filtro = {nombre: nombre};
        return await this.collection.findOne(filtro);
    }

    public subirLugar(lugar: LugarDesarrollo){
        this.collection.insertOne(JSON.parse(JSON.stringify(lugar)));
    }

    public borrarLugar(nombre: String){
        const filtro = { nombre: nombre };
        this.collection.findOneAndDelete(filtro);
    }

    public modificarLugar(lugar: LugarDesarrollo){
        const filtro = {nombre: lugar.nombre};
        this.collection.findOneAndReplace(filtro, JSON.parse(JSON.stringify(lugar)));
    }
}