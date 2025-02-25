import express from 'express';
import configs from '../configs.js';
import router from './router.js';
import path, { dirname } from 'path';
import WebSocketHandler from './controllers/WebSocketHandler.js';
import Game from './controllers/Game.js';
import { fileURLToPath } from 'url';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Server {
  static app = express();
  static publicPath = path.join(__dirname, '../client');

  static init () {
    this.configureMiddleware();
    this.configureRoutes();
    this.start();
  }

  static configureMiddleware () {
    this.app.use(express.static(this.publicPath));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: { secure: false, expires: null, maxAge: null } }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  static configureRoutes () {
    this.app.use('/', router);
  }

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
