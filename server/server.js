import express from 'express';
import configs from '../configs.js';
import router from './router.js';
import path, { dirname } from 'path';
import WebSocketHandler from './controllers/WebSocketHandler.js';
import Game from './controllers/Game.js';
import { fileURLToPath } from 'url';
// import session from 'express-session';
import dotenv from 'dotenv';
// import passport from 'passport';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Clase Server
 * Esta clase configura y arranca el servidor Express, incluyendo middleware, rutas y WebSocket.
 */
export class Server {
  static app = express();
  static publicPath = path.join(__dirname, '../client');

  /**
   * Inicializa el servidor
   * Configura el middleware y las rutas del servidor
   * Inicia el servidor
   */
  static init () {
    this.configureMiddleware();
    this.configureRoutes();
    this.start();
  }

  /**
   * Configura el middleware para el servidor
   * Establece express.static() para servir archivos estáticos
   * Establece express.json() y express.urlencoded() para parsear peticiones
   * Establece session() para manejar sesiones de los usuarios
   * Establece passport.initialize() y passport.session() para autenticación
   */
  static configureMiddleware () {
    this.app.use(express.static(this.publicPath));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    // this.app.use(session({
    //   secret: process.env.SESSION_SECRET,
    //   resave: false,
    //   saveUninitialized: true,
    //   cookie: { secure: false, expires: null, maxAge: null }
    // }));
    // this.app.use(passport.initialize());
    // this.app.use(passport.session());
  }

  /**
   * Configura las rutas del servidor
   * Usa el router principal para manejar las rutas
   */
  static configureRoutes () {
    this.app.use('/', router);
  }

  /**
   * Inicia el servidor
   * Escucha en el puerto y host configurados
   * Inicia el manejador de WebSocket y el juego
   */
  static start () {
    this.app.listen(configs.port, configs.host, () => {
      console.log(`Servidor corriendo en http://${configs.host}:${configs.port}`);
    });
    // Iniciar el servidor WebSocket y el juego
    WebSocketHandler.init();
    Game.init();
  }
}

// Ejecutar el servidor
Server.init();
