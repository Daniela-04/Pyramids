import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { AuthController } from './controllers/AuthController.js';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RouterConfig {
  static router = express.Router();

  /**
   * Inicializa el router
   * Configura las rutas y el controlador de autenticación
   * @returns {Router} El router configurado
   */
  static init () {
    this.configureRoutes();
    AuthController.initialize();
    return this.router;
  }

  /**
   * Configura las rutas del router
   * Llama a los métodos para configurar rutas GET y de autenticación
   */
  static configureRoutes () {
    this.configureGetRoutes();
    this.configureAuthRoutes();
  }

  /**
   * Configura las rutas GET del router
   * Define las rutas para servir archivos HTML
   */
  static configureGetRoutes () {
    this.router.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    });
    this.router.get('/choose', RouterConfig.isAuthenticated, (req, res) => {
      res.sendFile(path.join(__dirname, '../client/html/seleccio_rol.html'));
    });
    this.router.get('/player', RouterConfig.isAuthenticated, (req, res) => {
      res.sendFile(path.join(__dirname, '../client/html/player.html'));
    });

    this.router.get('/admin', RouterConfig.isAuthenticated, (req, res) => {
      res.sendFile(path.join(__dirname, '../client/html/admin.html'));
    });
    this.router.get('/lobby', RouterConfig.isAuthenticated, (req, res) => {
      res.sendFile(path.join(__dirname, '../client/html/lobby.html'));
    });
  }

  /**
   * Configura las rutas de autenticación del router
   * Define las rutas para login y logout usando Passport
   */
  static configureAuthRoutes () {
    this.router.get('/logout', (req, res, next) => {
      req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
      });
    });

    this.router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] }));

    this.router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
      (req, res) => {
        res.redirect('/choose');
      });
    this.router.get('/logout', (req, res, next) => {
      req.logout();
      res.redirect('/');
    });
  }

  /**
   * Middleware para verificar si el usuario está autenticado
   * @param {Request} req - La solicitud HTTP
   * @param {Response} res - La respuesta HTTP
   * @param {Function} next - La función next para pasar al siguiente middleware
   */
  static isAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
}

// Exportamos el router ya configurado
export default RouterConfig.init();
