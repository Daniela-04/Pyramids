import express from 'express';
import configs from './configs.js';
import router from './router.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

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
  }

  static configureRoutes () {
    this.app.use('/', router);
  }

  static start () {
    this.app.listen(configs.port, configs.host, () => {
      console.log(`Servidor corriendo en http://${configs.host}:${configs.port}`);
    });
  }
}

// Ejecutar el servidor
Server.init();
