import { TipoUsuario } from "./TipoUsuario";

export class Usuario{
 correo: String;
 contraseña: String;
 nombre: String;
 fotoPerfil: String;
 tipoUsuario: TipoUsuario;

 constructor(correo: string, contraseña: String, nombre: String, fotoPerfil: string, tipoUsuario: TipoUsuario){
    this.correo = correo;
    this.contraseña = contraseña;
    this.nombre = nombre;
    this.fotoPerfil = fotoPerfil;
    this.tipoUsuario = tipoUsuario
    }
}