import { verificarDominio } from '../verificacionDominio';
import { Router } from 'express';
import { AccesoUsuario } from '../AccesoBD/AccesoUsuarios';
import { Db, MongoClient } from 'mongodb';
import { generarClaveAdmin, verificarClaveAdmin } from '../jwt';
import { Administrador } from '../Administrador';

// Base de datos
const url: string = "mongodb://127.0.0.1:27017/Gestion-de-eventos-academicos";
const client: MongoClient = new MongoClient(url);
const database: Db = client.db("Gestion-de-eventos-academicos");
var accesoUsuario: AccesoUsuario = new AccesoUsuario(url, database, database.collection("Administrador"));

accesoUsuario.borrarUsuario("admin");
const usuarioTemp = new Administrador("admin", "admin123", true);
accesoUsuario.subirUsuario(usuarioTemp);

export function checkAdmin(req: any, res: any, next:any){
    accesoUsuario.getUsuario(req.body.nombreUsuario).then((v) => {
        if(v == undefined){
            res.status(404).send("usuario no encontrado");
            return;
        }
        else{
            next()
        }
    })
}

export function checkSuper(req: any, res: any, next:any){
    accesoUsuario.getUsuario(req.body.nombreUsuario).then((v) => {
        if(v == undefined){
            res.status(404).send("usuario no encontrado");
            return;
        }
        else{
            if(v.esSuper){
                next()
            }
            else{
                res.status(400).send("permisos insuficientes");
            }
        }
    })
}

// Enrutador
export const RutasAdmin = Router();

RutasAdmin.post("/LoginAdministrador", (req, res) => {
    accesoUsuario.getUsuario(req.body.nombre).then((b) => {
        if(b == undefined){
            res.status(400).send("No existe");
            return;
        }
        else{
            accesoUsuario.login(req.body.nombre, req.body.contraseña).then((v) => {
                if (v) {
                    if (v == "todo bien") {
                        let respuesta: JSON = JSON.parse(JSON.stringify(b));
                        Object.assign(respuesta, { "claveJWT": generarClaveAdmin(req.body.nombre) });
                        res.json(respuesta);
                    }
                    else {
                        res.status(400).json(v);
                    }
                }
            })
        }
    })
})

// Lista admin
RutasAdmin.get("/administradores", (req, res) =>{
    accesoUsuario.getUsuarios().then((v) => {
        res.json(v);
    })
})

// Admin segun nombre
RutasAdmin.get("/administradores/:nombre", (req, res) =>{
    accesoUsuario.getUsuario(req.params.nombre).then((v) => {
        res.json(v);
    })
})

//subir nuevo admin
RutasAdmin.post("/administradores", (req, res) => {
    accesoUsuario.getUsuario(req.body.nombre).then((v) => {
        if (v != undefined) {
            res.send("no se pudo crear, nombre ya en uso");
            return;
        }
        else {
            const usuarioTemp = new Administrador(req.body.nombre, req.body.contraseña, req.body.esSuper)
            accesoUsuario.subirUsuario(usuarioTemp);
            res.json(usuarioTemp);
        }
    })
})

//borrar admin
RutasAdmin.delete("/administradores/:nombre", (req, res) => {
    accesoUsuario.getUsuario(req.params.nombre).then((v) => {
        if (v == undefined) {
            res.send("no existe");
            return;
        }
        else {
            accesoUsuario.borrarUsuario(req.params.nombre);
            res.status(204).send();
        }
    })
})
//modificar todo el admin
RutasAdmin.put("/administradores/:nombre", (req, res) => {
    accesoUsuario.getUsuario(req.params.nombre).then((v) => {
        if (v == undefined) {
            res.send("no existe");
            return;
        }
        else {
            const usuarioTemp = new Administrador(req.body.nombre, req.body.contraseña, req.body.esSuper);
            usuarioTemp.nombre = v.nombre;
            accesoUsuario.modificarUsuario(usuarioTemp);
            res.json(usuarioTemp);
        }
    })
})

//modificar parte del admin
RutasAdmin.patch("/administradores/:nombre", (req, res) => {
    accesoUsuario.getUsuario(req.params.nombre).then((v) => {
        if (v == undefined) {
            res.send("no existe");
            return;
        }
        else {
            var usuarioTemp = new Administrador(v.nombre, v.contraseña, v.esSuper);
            if (req.body.contraseña) {
                usuarioTemp.contraseña = req.body.contraseña;
            }
            if (req.body.esSuper) {
                usuarioTemp.esSuper = req.body.esSuper;
            }
            accesoUsuario.modificarUsuario(usuarioTemp);
            res.json(usuarioTemp);
        }
    })
})