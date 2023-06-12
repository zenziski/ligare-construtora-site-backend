import { IUserErrors, IUser } from "../../DTO/user.dto"; 

module.exports = (app: any) => ({
    verb: "get",
    route: '/:userId',
    handler: async (req: any, res: any) => {
        const { User } = app.models;
        const { userId } = req.params;
        try {
            const user: IUser = await User.findOne({ _id: userId });
            if(!user) throw new Error(IUserErrors.NOT_FOUND)
            return res.status(201).json(user)
        } catch (error: any) {
            if(error.message) return res.status(400).json({error: error.message})
            return res.status(400).json({error: "Algo aconteceu!"})
        }
    }
});