import express from 'express';
import configs from './configs.js';
import router from './router.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const publicPath = path.join(__dirname, '../client');

const app = express();

app.use(express.static(publicPath));

app.use('/', router);

app.listen(configs.port, configs.host, () => (
  console.log(`Servidor corriendo en http://${configs.host}:${configs.port}`)
));
