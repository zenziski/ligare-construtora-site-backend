import { Request, Response } from "express";
import { IUser } from "../../DTO/user.dto";

module.exports = (app: any) => ({
    verb: "get",
    route: '/',
    handler: async (req: Request, res: Response) => {
        const { User } = app.models;
        const users: IUser[] = await User.find({});
        return res.json(users)
    }
});