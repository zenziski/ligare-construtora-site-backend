import { IUserErrors, IUser, IUserLogin } from "../../DTO/user.dto";
import bcrypt from 'bcrypt';

module.exports = (app: any) => ({
    verb: "post",
    route: '/auth',
    anonymous: true,
    handler: async (req: any, res: any) => {
        const Jwt = require('../../config/jwt')();
        const { User } = app.models;
        const userData: IUserLogin = req.body
        try {
            const user: IUser = await User.findOne({ email: userData.email }).lean();

            if (!user) throw {message: IUserErrors.NOT_FOUND, code: 404}

            const passwordMatch = await bcrypt.compare(userData.password, user.password)
            if(!passwordMatch) throw {message: IUserErrors.WRONG_PASSWORD, code: 401}

            const token = Jwt.generate({
                userId: user._id,
            })

            return res.status(201).json({token})
        } catch (error: any) {
            if (error.message) return res.status(error.code || 500).json({ error: error.message })
            return res.status(400).json({ error: "Algo aconteceu!" })
        }
    }
});