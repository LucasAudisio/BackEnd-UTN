import { verificarDominio } from '../verificacionDominio';
import { Router } from 'express';
import { Investigador } from '../Investigador';
import { AccesoUsuario } from '../AccesoBD/AccesoUsuarios';
import { Db, MongoClient } from 'mongodb';
import { generarClaveInv, verificarClaveAdmin } from '../jwt';
import { checkAdmin } from './ControladorAdministradores';

// Regex
const mailRegex: RegExp = new RegExp("[A-Za-z0-9]+@[a-z]+\.[a-z]{2,3}");
const contraRegex: RegExp = new RegExp("[a-z0-9A-Z]");
const fotoRegex: RegExp = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$");

// Base de datos
const url: string = "mongodb://127.0.0.1:27017/Gestion-de-eventos-academicos";
const client: MongoClient = new MongoClient(url);
const database: Db = client.db("Gestion-de-eventos-academicos");
var accesoUsuario: AccesoUsuario = new AccesoUsuario(url, database, database.collection("Investigador"))

// Enrutador
export const RutasUsuarios = Router();

//lista de usuarios
RutasUsuarios.get("/investigadores", checkAdmin, (_req, _res) => {
    accesoUsuario.getUsuarios().then((v) => {
        _res.send(v);
    })
})

//datos del usuario segun id
RutasUsuarios.get("/investigadores/:nombre", checkAdmin, (_req, _res) => {
    accesoUsuario.getUsuario(_req.params.nombre).then((v) => {
        _res.send(v);
    })
})

//subir nuevo usuario
RutasUsuarios.post("/investigadores", checkAdmin, (_req, _res) => {
    console.log(_req.body)
    accesoUsuario.getUsuario(_req.body.nombre).then((v) => {
        if (v != undefined) {
            _res.send("no se pudo crear, nombre ya en uso");
            return;
        }
        else {
            const usuarioTemp = new Investigador(_req.body.correo, _req.body.contraseña, _req.body.nombre, _req.body.foto);
            accesoUsuario.subirUsuario(usuarioTemp);
            _res.json(usuarioTemp);
        }
    })
})

//borrar usuario
RutasUsuarios.delete("/investigadores/:nombre", checkAdmin, (_req, _res) => {
    accesoUsuario.getUsuario(_req.params.nombre).then((v) => {
        if (v == undefined) {
            _res.send("no existe");
            return;
        }
        else {
            accesoUsuario.borrarUsuario(_req.params.nombre);
            _res.status(204).send();
        }
    })
})
//modificar todo el usuario
RutasUsuarios.put("/investigadores/:nombre", checkAdmin, (_req, _res) => {
    accesoUsuario.getUsuario(_req.params.nombre).then((v) => {
        if (v == undefined) {
            _res.send("no existe");
            return;
        }
        else {
            const usuarioTemp = new Investigador(_req.body.correo, _req.body.contraseña, _req.body.nombre, _req.body.foto);
            usuarioTemp.nombre = v.nombre;
            accesoUsuario.modificarUsuario(usuarioTemp);
            _res.json(usuarioTemp);
        }
    })
})

//modificar parte del usuario
RutasUsuarios.patch("/investigadores/:nombre", checkAdmin, (_req, _res) => {
    accesoUsuario.getUsuario(_req.params.nombre).then((v) => {
        if (v == undefined) {
            _res.send("no existe");
            return;
        }
        else {
            var usuarioTemp = new Investigador(v.correo, v.contraseña, v.nombre, v.foto);
            if (_req.body.correo) {
                usuarioTemp.correo = _req.body.correo;
            }
            if (_req.body.contraseña) {
                usuarioTemp.contraseña = _req.body.contraseña;
            }
            if (_req.body.fotoPerfil) {
                usuarioTemp.fotoPerfil = _req.body.fotoPerfil;
            }
            accesoUsuario.modificarUsuario(usuarioTemp);
            _res.json(usuarioTemp);
        }
    })
})
// Registrarse
RutasUsuarios.post("/registrarse", (_req, _res) => {
    console.log("epic")
    //  mail formato valido
    if (!mailRegex.test(_req.body.correo)) {
        _res.status(400).send("mail invalido");
        return;
    }

    // contraseña formato seguro
    if (_req.body.contraseña.length < 8 || !contraRegex.test(_req.body.contraseña)) {
        _res.status(400).send("contraseña insegura");
        return;
    }
    console.log("epic2")
    accesoUsuario.getUsuario(_req.body.nombre).then((v: any) => {
        if (v != undefined) {
            _res.status(400).send("nombre de usuario ya en uso");
        }
        else {
            accesoUsuario.getUsuario(_req.body.correo).then((b: any) => {
                if (v != undefined) {
                    _res.status(400).send("nombre de usuario ya en uso");
                }
                else {
                    accesoUsuario.registrarse(_req.body.nombre, _req.body.contraseña, _req.body.correo).then((b) => {
                        _res.json(b);
                    })
                }
            })
        }
    })
})
// Login
RutasUsuarios.post("/login", (_req, _res) => {
    accesoUsuario.getUsuario(_req.body.nombre).then((b) => {
        if (b) {
            accesoUsuario.login(_req.body.nombre, _req.body.contraseña).then((v) => {
                if (v) {
                    if (v == "todo bien") {
                        let respuesta: JSON = JSON.parse(JSON.stringify(b));
                        Object.assign(respuesta, { "claveJWT": generarClaveInv(_req.body.nombre) });
                        _res.json(respuesta);
                    }
                    else {
                        _res.status(400).json(v);
                    }
                }
            });
        }
        else {
            _res.status(404).json("usuario no encontrado");
        }
    })
})