import { Router } from "express";
import { Db, MongoClient } from "mongodb";
import { AccesoLugar } from "../AccesoBD/AccesoLugar";
import { LugarDesarrollo } from "../LugarDesarrollo";
import { verificarClaveAdmin } from "../jwt";
import { AccesoEvento } from "../AccesoBD/AccesoEvento";
export const rutasLugar = Router();

const url: string = "mongodb://127.0.0.1:27017/Gestion-de-eventos-academicos";
const client: MongoClient = new MongoClient(url);
const database: Db = client.db("Gestion-de-eventos-academicos");

var accesoLugar: AccesoLugar = new AccesoLugar(url, database, database.collection("LugarDesarrollo"));

// lista de lugares
rutasLugar.get("/lugares", verificarClaveAdmin, (req, res) => {
    accesoLugar.getLugares().then((v) => {
        res.send(v);
    })
})

// lugar por nombre
rutasLugar.get("/lugares/:nombre", verificarClaveAdmin, (req, res) => {
    accesoLugar.getLugar(req.params.nombre).then((v) => {
        res.send(v);
    })
})

// subir por lugar
rutasLugar.post("/lugares", verificarClaveAdmin, (req, res) => {
    if (!req.body.nombre || !req.body.direccion || !req.body.fotoLugar) {
        res.status(400).send("no se proporcionaron todos los datos");
        return;
    }
    accesoLugar.getLugar(req.body.nombre).then((v) => {
        if (v != undefined) {
            res.status(400).send("ya existe un lugar con ese nombre");
            return;
        }
        const lugar = new LugarDesarrollo(req.body.nombre, req.body.direccion, req.body.fotoLugar);
        accesoLugar.subirLugar(lugar);

        res.json(lugar);
    })
})

// borrar lugar por nombre
rutasLugar.delete("/lugares/:nombre", verificarClaveAdmin, (req, res) => {
    accesoLugar.getLugar(req.body.nombre).then((v) => {
        if (v == undefined) {
            res.status(400).send("no existe un lugar con ese nombre");
            return;
        }
        accesoLugar.borrarLugar(req.params.nombre);
        res.send("lugar borrado");
    })
})

// modificar lugar por nombre
rutasLugar.patch("/lugares/:nombre", verificarClaveAdmin, (req, res) => {
    accesoLugar.getLugar(req.body.nombre).then((v) => {
        if (v == undefined) {
            res.status(400).send("no existe un lugar con ese nombre");
            return;
        }
        const lugar: LugarDesarrollo = new LugarDesarrollo(v.nombre, v.direccion, v.fotoLugar);
        if(req.body.direccion){
            lugar.direccion = req.body.direccion;
        }
        if(req.body.fotoLugar){
            lugar.fotoLugar = req.body.fotoLugar;
        }
        accesoLugar.modificarLugar(lugar);
        res.json(lugar);
    })
})