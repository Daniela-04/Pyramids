
export class AuthController {
  static async login (fields, res) {
    const email = fields.email;

    if (!email.endsWith('@sapalomera.cat')) {
      return res.status(403).json({ error: 'Dominio no permitido' });
    } else {
      return res.redirect('/choose');
    }
  }
}
