import { sign, verify as _verify } from 'jsonwebtoken';

let secret = "MXGaKZ8t6V8asdhuahuassadhuadahsuda82381hasd78ad8712h78ehqfm2ajnYBcs3K4MPCBWTmB";

module.exports = (app: any) => {
  return {
    generate: (payload: any) => {
      return sign(payload, secret, { expiresIn: '12h' });
    },
    verify: (token: string) => {
      return _verify(token, secret);
    }
  }
};