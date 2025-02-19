import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { IncomingForm } from 'formidable';
import { AuthController } from './controllers/AuthController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RouterConfig {
  static router = express.Router();

  static init () {
    this.configureRoutes();
    return this.router;
  }

  static configureRoutes () {
    this.configureGetRoutes();
    this.configurePostRoutes();
  }

  static configureGetRoutes () {
    this.router.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    });
    this.router.get('/choose', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/html/seleccio_rol.html'));
    });
    this.router.get('/player', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/html/player.html'));
    });

    this.router.get('/admin', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/html/admin.html'));
    });
  }

  static configurePostRoutes () {
    this.router.post('/login', (req, res) => {
      const form = new IncomingForm();

      form.parse(req, (err, fields) => {
        if (err) {
          return res.status(400).json({ error: 'Error al procesar el formulario' });
        }

        AuthController.login(fields, res);
      });
    });
  }
}

// Exportamos el router ya configurado
export default RouterConfig.init();
