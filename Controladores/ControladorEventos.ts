import { Router } from "express";
import { Db, MongoClient } from "mongodb";
import { AccesoEvento } from "../AccesoBD/AccesoEvento";
import { Evento } from "../Evento";
import { checkAdmin } from "./ControladorAdministradores";

const url: string = "mongodb://127.0.0.1:27017/Gestion-de-eventos-academicos";
const client: MongoClient = new MongoClient(url);
const database: Db = client.db("Gestion-de-eventos-academicos");

var accesoEventos: AccesoEvento = new AccesoEvento(url, database, database.collection("Evento"));

export const RutasEventos = Router();

//lista de eventos
RutasEventos.get("/eventos", checkAdmin, (_req,_res) => {
    accesoEventos.getEventos().then((v)=>{
        _res.send(v);
    })
})
  
//datos del usuario segun evento
RutasEventos.get("/eventos/:nombre", checkAdmin, (_req,_res) => {
    accesoEventos.getEvento(_req.params.nombre).then((v)=>{
        _res.send(v);
    })
})
  
//subir nuevo evento
RutasEventos.post("/eventos", checkAdmin, (_req,_res) => {
    console.log(_req.body)
    accesoEventos.getEvento(_req.body.nombre).then((v)=>{
        if(v != undefined){
            _res.send("no se pudo crear");
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
RutasEventos.delete("/eventos/:nombre", checkAdmin, (_req,_res) => {
    accesoEventos.getEvento(_req.params.nombre).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            accesoEventos.borrarEvento(_req.params.nombre);
            _res.status(204).send();
        }
    })
})

//modificar todo el evento
RutasEventos.put("/eventos/:nombre", checkAdmin, (_req,_res) => {
    accesoEventos.getEvento(_req.params.nombre).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            const eventoTemp: Evento = new Evento(_req.body.nombre, _req.body.fecha, 
                _req.body.fechaCierreConvocatoria, _req.body.lugarDesarrollo, _req.body.tags,
                _req.body.usuarios);
            accesoEventos.modificarEvento(eventoTemp);
            _res.json(eventoTemp);
        }
    })
})

//modificar parte del evento
RutasEventos.patch("/eventos/:nombre", checkAdmin, (_req,_res) => {
    accesoEventos.getEvento(_req.params.nombre).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            var eventoTemp: Evento = new Evento(v.nombre, v.fecha, v.fechaCierreConvocatoria
                , v.lugarDesarrollo, v.tags, v.usuarios);
            if(_req.body.fecha){
                eventoTemp.fecha = _req.body.fecha;
            }
            if(_req.body.fechaCierreConvocatoria){
                eventoTemp.fechaCierreConvocatoria = _req.body.fechaCierreConvocatoria;
            }
            if(_req.body.lugarDesarrollo){
                eventoTemp.lugarDesarrollo = _req.body.lugarDesarrollo;
            }
            if(_req.body.tags){
                eventoTemp.tags = _req.body.tags;
            }
            if(_req.body.usuarios){
                eventoTemp.usuarios = _req.body.usuarios;
            }
            accesoEventos.modificarEvento(eventoTemp);
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
RutasEventos.get("/eventos/busquedaTags/:tags", (_req, _res) => {
    accesoEventos.getEventoTag(_req.params.tags.split(",")).then((v) => {
        _res.json(v);
    })
})