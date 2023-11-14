import { Router } from "express";
import { Db, MongoClient } from "mongodb";
import { AccesoEvento } from "../AccesoBD/AccesoEvento";
import { Evento } from "../Evento";
import { verificarClaveAdmin } from "../jwt";

const url: string = "mongodb://127.0.0.1:27017/Gestion-de-eventos-academicos";
const client: MongoClient = new MongoClient(url);
const database: Db = client.db("Gestion-de-eventos-academicos");

var accesoEventos: AccesoEvento = new AccesoEvento(url, database, database.collection("Evento"));

export const RutasEventos = Router();

function isValidDate(dateString: string): boolean {
    const dateParts = dateString.split("-");

    if (dateParts.length !== 3) {
        return false;
    }

    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return false;
    }

    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

//lista de eventos
RutasEventos.get("/eventos", (_req,_res) => {
    accesoEventos.getEventos().then((v)=>{
        _res.send(v);
    })
})
  
//datos del usuario segun id
RutasEventos.get("/eventos/:_id", (_req,_res) => {
    accesoEventos.getEventoPorId(_req.params._id).then((v)=>{
        _res.send(v);
    })
})
  
//subir nuevo evento
RutasEventos.post("/eventos", verificarClaveAdmin, (_req,_res) => {
    console.log(_req.body)
    if(!_req.body.nombre || !_req.body.fecha || !_req.body.fechaCierreConvocatoria || !_req.body.lugarDesarrollo){
        _res.status(400).send("no se proporcionaron todos los datos");
        return;
    }
    if(!isValidDate(_req.body.fecha)){
        _res.status(400).send("fecha invalida");
        return;
    }
    if(!isValidDate(_req.body.fechaCierreConvocatoria)){
        _res.status(400).send("fecha del cierre de la convocatoria invalida");
        return;
    }

    // falta checkear si existe lugar, q sean validos los tags y usuarios

    accesoEventos.getEvento(_req.body.nombre).then((v)=>{
        if(v != undefined){
            _res.send("no se pudo crear, ya existe un evento con ese nombre");
            return;
        }
        else{
            const eventoTemp: Evento = new Evento(_req.body.nombre, _req.body.fecha, 
                _req.body.fechaCierreConvocatoria, _req.body.lugarDesarrollo, _req.body.tags,
                _req.body.usuarios);
            accesoEventos.subirEvento(eventoTemp);
            _res.json(eventoTemp);
        }
    })
})

//borrar evento
RutasEventos.delete("/eventos/:_id", verificarClaveAdmin, (_req,_res) => {
    accesoEventos.getEvento(_req.params._id).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            accesoEventos.borrarEvento(_req.params._id);
            _res.status(204).send();
        }
    })
})

//modificar parte del evento
RutasEventos.patch("/eventos/:_id", verificarClaveAdmin, (_req,_res) => {
    accesoEventos.getEvento(_req.params._id).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            var eventoTemp: Evento = new Evento(v.nombre, v.fecha, v.fechaCierreConvocatoria
                , v.lugarDesarrollo, v.tags, v.usuarios);
            if(_req.body.fecha){
                if(!isValidDate(_req.body.fecha)){
                    _res.status(400).send("fecha invalida");
                    return;
                }
                eventoTemp.fecha = _req.body.fecha;
            }
            if(_req.body.fechaCierreConvocatoria){
                if(!isValidDate(_req.body.fechaCierreConvocatoria)){
                    _res.status(400).send("fecha del cierre de la convocatoria invalida");
                    return;
                }
                eventoTemp.fechaCierreConvocatoria = _req.body.fechaCierreConvocatoria;
            }
            // checkear lugar existe, tags validos y usuarios validos
            if(_req.body.lugarDesarrollo){
                eventoTemp.lugarDesarrollo = _req.body.lugarDesarrollo;
            }
            if(_req.body.tags){
                eventoTemp.tags = _req.body.tags;
            }
            if(_req.body.usuarios){
                eventoTemp.usuarios = _req.body.usuarios;
            }
            accesoEventos.modificarEvento(eventoTemp, _req.params._id);
            _res.json(eventoTemp);
        }
    })
})

//lista tags
RutasEventos.get("/eventosTags", (_req, _res) => {
    accesoEventos.getTags().then((v) => {
        _res.json(v);
    })
})

//busqueda eventos por tags
RutasEventos.get("/eventos/busquedaTags", (_req, _res) => {
    accesoEventos.getEventoTag(_req.body.tags).then((v) => {
        _res.json(v);
    })
})