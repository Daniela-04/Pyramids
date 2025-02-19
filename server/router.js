import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RouterConfig {
  static router = express.Router();

  static init () {
    this.configureRoutes();
    return this.router;
  }

  static configureRoutes () {
    this.router.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    });

    // Puedes agregar más rutas aquí si es necesario
  }
}

// Exportamos el router ya configurado
export default RouterConfig.init();
