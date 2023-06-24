import { IUserErrors, IUser, IUserRegister } from "../../DTO/user.dto";
import bcrypt from 'bcrypt';

module.exports = (app: any) => ({
    verb: "post",
    route: '/register',
    handler: async (req: any, res: any) => {
        const { User } = app.models;
        const userData: IUserRegister = req.body
        try {
            const user = await User.findOne({ email: userData.email }).lean();
            if (user) throw { message: IUserErrors.EMAIL_ALREADY_IN_USE, code: 401 }
            if (!userData.password) throw { message: IUserErrors.REQUIRED_FIELD, code: 401 }

            const salt = await bcrypt.genSalt(12);
            const hashPassword = await bcrypt.hash(userData.password, salt);
            await User.create({
                name: userData.name,
                email: userData.email,
                password: hashPassword
            })
            return res.json({created: true})
        } catch (error: any) {
            if (error.message) return res.status(error.code || 500).json({ error: error.message })
            return res.status(400).json({ error: "Algo aconteceu!" })
        }
    }
});