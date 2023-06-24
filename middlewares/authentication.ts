const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

module.exports = (_app: any) => {
    return async (req: any, res: any, next: () => void) => {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.split(' ')[0].toLocaleLowerCase() === 'bearer')
            token = req.headers.authorization.split(' ')[1];
        try {
            jwt.verify(token, secret)
            next()
        } catch (error) {
            return res.status(400).json({message: "INVALID_TOKEN"})
        }
    }
};