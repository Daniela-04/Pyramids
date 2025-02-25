import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export class AuthController {
  static initialize () {
    dotenv.config();
    passport.use(new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
      if (profile._json.hd === 'sapalomera.cat') {
        return done(null, profile);
      }
      return done(null, false, { message: 'Dominio no permitido' });
    }));

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }
}
