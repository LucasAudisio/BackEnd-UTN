import express from 'express';
import { RutasUsuarios } from './Controladores/ControladorUsuarios';
import { RutasEventos } from './Controladores/ControladorEventos';
import { createHash } from 'node:crypto';
import { RutasAdmin } from './Controladores/ControladorAdministradores';
import { verificarDominio } from './verificacionDominio';
import { verificarClaveAdmin, verificarClaveInv } from './jwt';
import { checkAdmin } from './Controladores/ControladorAdministradores';
import { checkSuper } from './Controladores/ControladorAdministradores';
import bodyParser from 'body-parser';

const app = express();

const port = 3000;

// console.log(createHash('sha256').update("123").digest('hex'))

app.get('/', (_req, _res) => {
    _res.send("API de UTN Gestion de eventos academicos");
});

//Middlewares
app.use(verificarDominio);
app.use(bodyParser.json());
app.use("/investigadores", verificarClaveAdmin, checkAdmin);
app.use("/administradores",verificarClaveAdmin, checkSuper);
app.use("/eventos", verificarClaveAdmin, checkAdmin);

//Rutas
app.use(RutasUsuarios);
app.use(RutasEventos);
app.use(RutasAdmin);

app.listen(port, () => console.log(`Escuchando en el puerto ${port}!`));