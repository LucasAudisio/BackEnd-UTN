import express from 'express';
import { RutasUsuarios } from './Controladores/ControladorUsuarios';
import { RutasEventos } from './Controladores/ControladorEventos';
import path from "path";
import { RutasAdmin } from './Controladores/ControladorAdministradores';
import { verificarClaveAdmin, verificarClaveInv } from './jwt';
import { checkAdmin } from './Controladores/ControladorAdministradores';
import { checkSuper } from './Controladores/ControladorAdministradores';
import bodyParser from 'body-parser';
import multer from "multer";
import cors from "cors";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'imagenes/' + file.fieldname); // Directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        console.log(file)
        const timestamp = new Date().getTime(); // Obtiene una marca de tiempo única
        const fileExtension = file.originalname.split('.').pop();
        const uniqueFilename = `${timestamp}.${fileExtension}`;
        req.body[file.fieldname] = uniqueFilename
        cb(null, uniqueFilename);
    },
  });
  
const upload = multer({ storage: storage });

const app = express();
app.use(cors());

const port = 3000;

// console.log(createHash('sha256').update("123").digest('hex'))

app.get('/', (_req, _res) => {
    _res.send("API de UTN Gestion de eventos academicos");
});

//Middlewares
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
app.use(upload.fields([{ name: 'fotoPerfil' }, {name: "fotoLugar"}]));
app.use(bodyParser.json());
app.use("/administradores", checkSuper);

//Rutas
app.use(RutasUsuarios);
app.use(RutasEventos);
app.use(RutasAdmin);

app.listen(port, () => console.log(`Escuchando en el puerto ${port}!`));