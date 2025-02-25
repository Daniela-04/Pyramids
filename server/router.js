import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { AuthController } from './controllers/AuthController.js';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RouterConfig {
  static router = express.Router();

  static init () {
    this.configureRoutes();
    AuthController.initialize();
    return this.router;
  }

  static configureRoutes () {
    this.configureGetRoutes();
    this.configureAuthRoutes();
  }

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

  // Middleware para verificar si el usuario está autenticado
  static isAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
}

// Exportamos el router ya configurado
export default RouterConfig.init();
