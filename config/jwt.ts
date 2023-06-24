import { sign, verify as _verify } from 'jsonwebtoken';

let secret = process.env.JWT_SECRET;

module.exports = (app: any) => {
  return {
    generate: (payload: any) => {
      return sign(payload, secret!, { expiresIn: '12h' });
    },
    verify: (token: string) => {
      return _verify(token, secret!);
    }
  }
};